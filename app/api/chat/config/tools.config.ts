const toolConfig = {
  local: {
    weather: {},
    "wikipedia.WikipediaToolSpec": {
      language: "en",
    },
    // interpreter: {},
    duckduckgo: {},
    // img_gen: {
    //   provider: "openai",
    //   model: "dall-e-3",
    // },
    artifact: {
      language: "typescript",
    },
    document_generator: {
      template: "default",
    },
    form_filling: {
      columns: ["name", "email", "phone"],
      strategy: "fill-missing",
    },
  },
  llamahub: {},
};

export default toolConfig;
