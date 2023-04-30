(function () {
    const classPrefix = "nomai-json-schema-"

    const getClass = (name: string) => `${classPrefix}${name}`

    interface SchemaContext {
        baseUri: URL | undefined
        root: JSONSchema
        path: string
        anchors: Record<string, any>
    }

    function resolveUri(uri: string, baseUri: URL | undefined) {
        return new URL(uri, baseUri)
    }

    function resolvePointer(ptr: string, obj: any, baseUri: URL | undefined) {
        if (ptr.includes("#") || ptr.includes("//")) {
            if (ptr.startsWith("#") && !baseUri) {
                ptr = ptr.substring(1)
            } else {
                const uri = new URL(ptr, baseUri)
                const hash = uri.hash
                uri.hash = ""
                if (!baseUri || uri.href !== baseUri.href) return null
                ptr = hash.startsWith("#") ? hash.substring(1) : hash
            }
        }
        try {
            const parts = ptr.split("/")
            if (!parts[0]) parts.shift()
            let o = obj
            while (parts.length) o = o[parts.shift()!]
            return o
        } catch (err) {
            return null
        }
    }

    function scrapeAnchors(v: any, anchors: Record<string, any>) {
        if (!v) return anchors
        if (Array.isArray(v)) {
            for (const el of v) scrapeAnchors(el, anchors)
        } else if (typeof v === "object") {
            if ("$anchor" in v) {
                const anchor = v.$anchor
                if (typeof anchor === "string") anchors[anchor] = v
            }
            if ("id" in v) {
                const id = v.id
                if (typeof id === "string") anchors[id] = v
            }
            if ("$id" in v) {
                const id = v.$id
                if (typeof id === "string" && id.startsWith("#")) anchors[id] = v
            }
            for (const key in v) {
                scrapeAnchors(v[key], anchors)
            }
        }
        return anchors
    }

    function AttributeBox({ name, value, isJson }: { name: string, value: JSONSchemaType | undefined, isJson?: boolean }) {
        if (value === null || value === undefined) return <></>
        const str = String(Array.isArray(value) ? value.map(v => isJson ? JSON.stringify(v) : v).join(", ") : isJson ? JSON.stringify(value) : value)
        return <div className={getClass("attribute")}>
            {name ? <span className={getClass("attribute-key")}>{name}:&nbsp;</span> : null}
            <span className={getClass("attribute-value")}>{str}</span>
        </div>
    }

    function JsonPropertyBox({ name, schema, required, ctx, startClosed }: { name: string, schema: JSONSchemaDefinition | null | undefined, required?: boolean, ctx: SchemaContext, startClosed?: boolean }) {
        const [open, setOpen] = React.useState(!startClosed)
        const toggleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(o => !o)
        }
        if (!schema || typeof schema === "boolean") return <></>
        const ctxValue: SchemaContext = { ...ctx, path: ctx.path ? `${ctx.path} → ${name}` : "Root" }
        return <div className={getClass("property")}>
            <div className={getClass("property-header")} onClick={toggleOpen}>
                <div className={getClass("property-key")}>{name}</div>
                {required ? <AttributeBox name="" value="Required" /> : null}
                <div className={getClass("spacer")} />
                <div className={getClass("property-arrow")}>{open ? <svg viewBox="0 0 1196 1196" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M1100.417 887q-10 10-23 10t-23-10l-457-482-457 482q-10 10-23 10t-23-10q-9-10-9-24t9-24l480-506q10-10 23-10t23 10l480 506q9 10 9 24t-9 24z"/></svg> : <svg viewBox="0 0 1196 1196" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path fill="currentColor" d="M1100.417 333q-10-10-23-10t-23 10l-457 482-457-482q-10-10-23-10t-23 10q-9 10-9 24t9 24l480 506q10 10 23 10t23-10l480-506q9-10 9-24t-9-24z"/></svg>}</div>
            </div>
            {open ? <JsonSchemaBox schema={schema} ctx={ctxValue} /> : null}
        </div>
    }

    function JsonSchemaBox({ schema, ctx }: { schema: JSONSchemaDefinition | null | undefined, ctx: SchemaContext }): JSX.Element {
        if (!schema || typeof schema === "boolean") return <></>
        try {
            const uri = schema.$id ? resolveUri(schema.$id, ctx.baseUri) : ctx.baseUri
            const ref = schema.$ref ? resolvePointer(schema.$ref, ctx.root, ctx.baseUri) : null
            if (ref) {
                return JsonSchemaBox({ schema: ref, ctx })
            }
            const ctxValue = uri?.href !== ctx.baseUri?.href ? { ...ctx, baseUri: uri } : ctx
            return <div className={getClass("schema")}>
                <div className={getClass("path")}>{ctxValue.path}</div>
                <div className={getClass("attributes")}>
                    {/* Meta attributes */}
                    <AttributeBox name="Type" value={schema.type} />
                    <AttributeBox name="ID" value={schema.$id} />
                    <AttributeBox name="Reference" value={schema.$ref} />
                    <AttributeBox name="Schema" value={schema.$schema} />
                    <AttributeBox name="Comment" value={schema.$comment} />
                    <AttributeBox name="Title" value={schema.title} />
                    <AttributeBox name="Default Value" value={schema.default} isJson />
                    <AttributeBox name="Deprecated" value={schema.deprecated} />
                    <AttributeBox name="Read-Only" value={schema.readOnly} />
                    <AttributeBox name="Write-Only" value={schema.writeOnly} />
                    <AttributeBox name="Examples" value={schema.examples} />
                    <AttributeBox name="Format" value={schema.format} />
                    {/* Common attributes */}
                    <AttributeBox name="Enum Values" value={schema.enum} isJson />
                    <AttributeBox name="Constant Value" value={schema.const} isJson />
                    {/* Number attributes */}
                    <AttributeBox name="Multiple Of" value={schema.multipleOf} />
                    <AttributeBox name="Maximum Value" value={schema.maximum} />
                    <AttributeBox name="Minimum Value" value={schema.minimum} />
                    <AttributeBox name="Maximum Value (Exclusive)" value={schema.exclusiveMaximum} />
                    <AttributeBox name="Minimum Value (Exclusive)" value={schema.exclusiveMinimum} />
                    {/* String attributes */}
                    <AttributeBox name="Maximum Length" value={schema.maxLength} />
                    <AttributeBox name="Minimum Length" value={schema.minLength} />
                    <AttributeBox name="Pattern (Regex)" value={schema.pattern} />
                    {/* Array attributes */}
                    <AttributeBox name="Maximum Items" value={schema.maxItems} />
                    <AttributeBox name="Minimum Items" value={schema.minItems} />
                    <AttributeBox name="Items Must Be Unique" value={schema.uniqueItems} />
                    <AttributeBox name="Contained Item Maximum" value={schema.maxContains} />
                    <AttributeBox name="Contained Item Minimum" value={schema.minContains} />
                    {/* Object attributes */}
                    <AttributeBox name="Maximum Property Count" value={schema.maxProperties} />
                    <AttributeBox name="Minimum Property Count" value={schema.maxProperties} />
                    <AttributeBox name="Required Properties" value={schema.required} />
                    {schema.dependentRequired ? Object.keys(schema.dependentRequired).map(key => <AttributeBox key={key} name={`Required If \`${key}\` Present`} value={schema.dependentRequired![key]} />) : null}
                    {schema.dependencies ? Object.keys(schema.dependencies).map(key => ({ key, value: schema.dependencies![key] })).map(({ key, value }) => Array.isArray(value) ? <AttributeBox key={key} name={`Required If \`${key}\` Present`} value={value} /> : null) : null}
                    {/* Content attributes */}
                    <AttributeBox name="Content Encoding" value={schema.contentEncoding} />
                    <AttributeBox name="Content Media Type" value={schema.contentMediaType} />
                </div>
                {schema.description ? <div className={getClass("description")}>
                    {schema.description}
                </div> : null}
                <div className={getClass("properties")}>
                    {/* Array properties */}
                    {schema.items ? Array.isArray(schema.items) ? schema.items.map((s, i) => <JsonPropertyBox name={`Array Item ${i}`} schema={s} ctx={ctxValue} />) : <JsonPropertyBox name="Array Items" schema={schema.items} ctx={ctxValue} /> : null}
                    <JsonPropertyBox name="Additional Array Items" schema={schema.additionalItems} ctx={ctxValue} />
                    <JsonPropertyBox name="Must Contain" schema={schema.contains} ctx={ctxValue} />
                    {/* Object properties */}
                    {schema.properties ? Object.keys(schema.properties).map(key => <JsonPropertyBox key={key} name={key} schema={schema.properties![key]} required={schema.required?.includes(key)} ctx={ctxValue} startClosed />) : null}
                    {schema.patternProperties ? Object.keys(schema.patternProperties).map(key => <JsonPropertyBox key={key} name={`Pattern (Regex): ${key}`} schema={schema.patternProperties![key]} ctx={ctxValue} />) : null}
                    {schema.additionalProperties ? <JsonPropertyBox name="Additional Properties" schema={schema.additionalProperties} ctx={ctxValue} /> : null}
                    {schema.dependentSchemas ? Object.keys(schema.dependentSchemas).map(key => <JsonPropertyBox name={`If \`${key}\` Present:`} schema={schema.dependentSchemas![key]} ctx={ctxValue} />) : null}
                    {schema.dependencies ? Object.keys(schema.dependencies).map(key => ({ key, value: schema.dependencies![key] })).map(({ key, value }) => Array.isArray(value) ? null : <JsonPropertyBox name={`If \`${key}\` Present:`} schema={value} ctx={ctxValue} />) : null}
                    <JsonPropertyBox name="Valid Property Names" schema={schema.propertyNames} ctx={ctxValue} />
                    {/* Content properties */}
                    <JsonPropertyBox name="Content" schema={schema.contentSchema} ctx={ctxValue} />
                </div>
            </div>
        } catch (error) {
            return <ErrorBox error={error} />
        }
    }

    function RootBox({ name, uri, schema }: { name: string | null | undefined, uri: string | null | undefined, schema: JSONSchema }) {
        const ctxValue: SchemaContext = { baseUri: uri ? new URL(uri) : undefined, root: schema, anchors: scrapeAnchors(schema, {}), path: "" }
        return <div className={getClass("root")}>
            <JsonPropertyBox name={name ?? schema.title ?? "Schema"} schema={schema} ctx={ctxValue} />
        </div>
    }

    function ErrorBox({ error }: { error: unknown }){
        return <div className={getClass("error")}>
            <>Failed to load JSON schema ({String(error)})</>
        </div>
    }

    interface LoadSchemaArgs {
        target: HTMLElement
        schema?: JSONSchema
        title?: string
        uri?: string
    }

    function loadJsonSchemaViewer(args: LoadSchemaArgs) {
        const container = document.createElement("div")
        const root = (window.ReactDOM as any).createRoot(container)
        
        try {
            if (args.schema) {
                root.render(<RootBox name={args.title} uri={args.uri} schema={args.schema} />)
            } else if (args.uri) {
                const onError = (error: any) => root.render(<ErrorBox error={error} />)
                fetch(args.uri).then(r => r.json(), onError).then(json => {
                    root.render(<RootBox name={args.title} uri={args.uri} schema={json} />)
                }, onError)
            } else {
                throw new Error('No schema object or URI provided')
            }
        } catch (error) {
            root.render(<ErrorBox error={error} />)
        }

        args.target.replaceWith(container)
    }

    window.addEventListener("DOMContentLoaded", () => {
        const scripts = [...document.getElementsByTagName("script")].filter(s => s.type === "application/schema+json")

        for (const script of scripts) {
            const title = script.getAttribute("data-name") ?? undefined
            const uri = script.getAttribute("data-uri") ?? script.src
            if (script.text) {
                const schema = JSON.parse(script.text)
                loadJsonSchemaViewer({ target: script, schema, title, uri })
            } else {
                loadJsonSchemaViewer({ target: script, title, uri })
            }
        }
        
        const dataElements = [...document.querySelectorAll<HTMLElement>("[data-nomai-json-schema]")]
        for (const el of dataElements) {
            const title = el.getAttribute("data-name") ?? undefined
            const uri = el.getAttribute("data-uri") ?? undefined
            loadJsonSchemaViewer({ target: el, title, uri })
        }
    })

    ; (window as any).Nomai = {
        ...((window as any).Nomai ?? {}),
        loadJsonSchemaViewer,
    }
})()