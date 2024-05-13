import {
  defineConfig,
  presetIcons,
  transformerVariantGroup,
  presetUno,
} from "unocss";

export default defineConfig({
  transformers: [transformerVariantGroup()],
  presets: [presetUno(), presetIcons()],
  safelist: ["i-lucide-grip"],
});
