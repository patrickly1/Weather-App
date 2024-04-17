import globals from "globals";
import pluginJs from "@eslint/js";
import someConfig from "some-other-config-you-use";
import eslintConfigPrettier from "eslint-config-prettier";



export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  someConfig,
  eslintConfigPrettier,
];s