# Nomai JSON Schema Viewer

An embeddable React app for browsing JSON schemas.

## Usage

When the page loads, the app will automatically replace script tags that have the JSON Schema mime type, as well as any other element with the `nomai-json-schema-viewer` attribute:

```html
<script type="application/schema+json" data-name="My Schema" src="https://example.com/my/schema.json"></script>
<script type="application/schema+json" data-name="My Schema" data-uri="https://example.com/my/schema.json">
{
    "$id": "https://example.com/my/schema.json",
    "type": "object",
    // etc.
}
</script>
<div data-nomai-json-viewer data-name="My Schema" data-uri="https://example.com/my/schema.json"></div>
```

It is also exposed on the global Window object, so you can invoke it programmatically if the automatic loading behavior is insufficient:

```javascript
window.Nomai.loadJsonSchemaViewer({
    target: elementToReplace,
    title: "My Schema", // optional; will use the schema's title property if it is set
    schema: myJsonSchemaObj, // optional if uri is provided; if no schema object is provided, the schema will be fetched asynchronously using the uri
    uri: "https://example.com/my/schema.json", // optional if schema is provided, but generally required to resolve internal URI references
});
```
