/**
 * Serialize a JSON-LD object for a <script type="application/ld+json"> block.
 *
 * `JSON.stringify` does not escape `<`, so a string value containing
 * `</script>` would terminate the tag and execute as markup. Today every
 * value fed in is a build-time constant, but escaping here means the day one
 * of them becomes dynamic is not the day this turns into an XSS vector.
 */
export const serializeJsonLd = (data: object) =>
  JSON.stringify(data).replace(/</g, '\\u003c')
