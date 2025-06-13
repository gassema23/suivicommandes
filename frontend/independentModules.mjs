import { createIndependentModules } from "eslint-plugin-project-structure";
export const independentModulesConfig = createIndependentModules({
  "modules": [
    {
      "name": "App folder",
      "pattern": "src/routes/**",
      "allowImportsFrom": [
        "src/app/globals.css",
        "{sharedImports}",
        "src/features/**",
        "src/routes/test-table/**"
      ]
    },

    {
      "name": "Features",
      "pattern": "src/features/**",
      "allowImportsFrom": ["{family_3}/**", "{sharedImports}"],
      "errorMessage": "🔥 A feature may only import items from shared folders and its own family. Importing items from another feature is prohibited. 🔥"
    },

    {
      "name": "Shared",
      "pattern": [
        "src/assets/**",
        "src/components/**",
        "src/hooks/**",
        "src/lib/**",
        "src/providers/**",
        "src/stores/**",
        "src/types/**",
        "src/constants/**",
        "src/shared/**",
        "src/routes/test-table/**"
      ],
      "allowImportsFrom": ["{sharedImports}"],
      "errorMessage": "🔥 Shared folders are not allowed to import items from the `features` and `app` folders. 🔥"
    },

    // All files not specified in the rules are not allowed to import anything.
    // Ignore files in `src/tasks/*` and `src/*`.
    {
      "name": "Unknown files",
      "pattern": [["src/**", "!src/*"]],
      "allowImportsFrom": [],
      "allowExternalImports": false,
      "errorMessage": "🔥 This file is not specified as an independent module in `independentModules.jsonc`. 🔥"
    }
  ],
  "reusableImportPatterns": {
    "sharedImports": [
      "src/assets/**",
        "src/components/**",
        "src/hooks/**",
        "src/lib/**",
        "src/providers/**",
        "src/stores/**",
        "src/types/**",
        "src/constants/**",
        "src/shared/**",
        "src/routes/test-table/**"
    ]
  }

});