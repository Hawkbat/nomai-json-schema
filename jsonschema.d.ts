// Type definitions for json-schema 4.0, 6.0 and 7.0
// Project: https://github.com/kriszyp/json-schema
// Definitions by: Boris Cherny <https://github.com/bcherny>
//                 Lucian Buzzo <https://github.com/lucianbuzzo>
//                 Roland Groza <https://github.com/rolandjitsu>
//                 Jason Kwok <https://github.com/JasonHK>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

//==================================================================================================
// JSON Schema Draft 07
//==================================================================================================
// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
//--------------------------------------------------------------------------------------------------

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
declare type JSONSchemaTypeName =
    | 'string' //
    | 'number'
    | 'integer'
    | 'boolean'
    | 'object'
    | 'array'
    | 'null';

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
declare type JSONSchemaType =
    | string //
    | number
    | boolean
    | JSONSchemaObject
    | JSONSchemaArray
    | null;

// Workaround for infinite type recursion
declare interface JSONSchemaObject {
    [key: string]: JSONSchemaType;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
declare interface JSONSchemaArray extends Array<JSONSchemaType> {}

/**
 * Meta schema
 *
 * Recommended values:
 * - 'http://json-schema.org/schema#'
 * - 'http://json-schema.org/hyper-schema#'
 * - 'http://json-schema.org/draft-07/schema#'
 * - 'http://json-schema.org/draft-07/hyper-schema#'
 *
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
 */
declare type JSONSchemaVersion = string;

/**
 * JSON Schema v7
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
declare type JSONSchemaDefinition = JSONSchema | boolean;
declare interface JSONSchema {
    $id?: string | undefined;
    $ref?: string | undefined;
    $schema?: JSONSchemaVersion | undefined;
    $comment?: string | undefined;

    /**
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
     */
    $defs?: {
              [key: string]: JSONSchemaDefinition;
    } | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
     */
    type?: JSONSchemaTypeName | JSONSchemaTypeName[] | undefined;
    enum?: JSONSchemaType[] | undefined;
    const?: JSONSchemaType | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
     */
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
     */
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
     */
    items?: JSONSchemaDefinition | JSONSchemaDefinition[] | undefined;
    additionalItems?: JSONSchemaDefinition | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    maxContains?: number | undefined;
    minContains?: number | undefined;
    contains?: JSONSchema | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
     */
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [key: string]: JSONSchemaDefinition;
    } | undefined;
    patternProperties?: {
        [key: string]: JSONSchemaDefinition;
    } | undefined;
    additionalProperties?: JSONSchemaDefinition | undefined;
    dependentRequired?: {
        [key: string]: string[];
    } | undefined;
    dependentSchemas?: {
        [key: string]: JSONSchemaDefinition;
    } | undefined;
    dependencies?: {
        [key: string]: JSONSchemaDefinition | string[];
    } | undefined;
    propertyNames?: JSONSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
     */
    if?: JSONSchemaDefinition | undefined;
    then?: JSONSchemaDefinition | undefined;
    else?: JSONSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
     */
    allOf?: JSONSchemaDefinition[] | undefined;
    anyOf?: JSONSchemaDefinition[] | undefined;
    oneOf?: JSONSchemaDefinition[] | undefined;
    not?: JSONSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
     */
    format?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
     */
    contentEncoding?: string | undefined;
    contentMediaType?: string | undefined;
    contentSchema?: JSONSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
     */
    definitions?: {
        [key: string]: JSONSchemaDefinition;
    } | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
     */
    title?: string | undefined;
    description?: string | undefined;
    default?: JSONSchemaType | undefined;
    deprecated?: boolean | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    examples?: JSONSchemaType | undefined;
}
