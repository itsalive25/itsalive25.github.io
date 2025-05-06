const { DateTime } = require("luxon");
const { JSDOM } = require("jsdom");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // Passthroughs
  eleventyConfig.addPassthroughCopy("**/**/*.js");
  // eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("**/*.png");
  eleventyConfig.addPassthroughCopy("**/*.css");
  eleventyConfig.addPassthroughCopy("**/*.woff");
  eleventyConfig.addPassthroughCopy("**/*.woff2");
  eleventyConfig.addPassthroughCopy("**/*.ttf");
  eleventyConfig.addPassthroughCopy("**/*.zip");
  eleventyConfig.addPassthroughCopy("**/*.jpg");
  eleventyConfig.addPassthroughCopy("**/*.mp4");
  eleventyConfig.addPassthroughCopy("**/*.yml");

  // Optionaler Filter
  eleventyConfig.addFilter("addTargetBlank", function(content) {
    const dom = new JSDOM(content);
    const links = dom.window.document.querySelectorAll("a");

    links.forEach(link => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    return dom.serialize();
  });

  // Shortcode
  eleventyConfig.addNunjucksAsyncShortcode("renderSection", async function (section) {
    if (!section || !section.inputContent || !section.inputPath) {
      throw new Error('Missing section content or path');
    }
    return await this.renderTemplate(section.inputContent, section.inputPath, section.data);
  });

  // Markdown-Parser mit Erweiterungen
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  // Externe Links mit target + rel
  const defaultLinkRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const href = tokens[idx].attrGet('href');
    if (href && href.startsWith('http') && !href.includes('deineseite.de')) {
      tokens[idx].attrSet('target', '_blank');
      tokens[idx].attrSet('rel', 'noopener');
    }
    return defaultLinkRender(tokens, idx, options, env, self);
  };

  // Paragraph mit nur Bildern: <p> entfernen
function onlyImages(children) {
  if (!children || children.length === 0) return false;

  return children.every(child =>
    child.type === 'image' ||
    (child.type === 'text' && child.content.trim() === '') // Leertext wie "\n"
  );
}


  // Paragraph open/close vorher sichern
  const defaultParagraphOpen = md.renderer.rules.paragraph_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  const defaultParagraphClose = md.renderer.rules.paragraph_close || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.paragraph_open = function(tokens, idx, options, env, self) {
    const next = tokens[idx + 1];
    if (next && next.type === 'inline' && onlyImages(next.children)) {
      return ''; // Paragraph-Tag entfernen, wenn nur Bilder vorhanden sind
    }
    return defaultParagraphOpen(tokens, idx, options, env, self);
  };

  md.renderer.rules.paragraph_close = function(tokens, idx, options, env, self) {
    const prev = tokens[idx - 1];
    if (prev && prev.type === 'inline' && onlyImages(prev.children)) {
      return ''; // Paragraph-Tag entfernen, wenn nur Bilder vorhanden sind
    }
    return defaultParagraphClose(tokens, idx, options, env, self);
  };

  // Markdown-Parser registrieren
  eleventyConfig.setLibrary("md", md);

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
