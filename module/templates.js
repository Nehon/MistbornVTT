/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/mistborn/templates/parts/sheet-attributes.html",
    "systems/mistborn/templates/parts/sheet-groups.html",
    "systems/mistborn/templates/parts/character-stats.hbs",
    "systems/mistborn/templates/parts/character-traits.hbs",
    "systems/mistborn/templates/parts/character-powers.hbs",
    "systems/mistborn/templates/parts/character-equipment.hbs"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};