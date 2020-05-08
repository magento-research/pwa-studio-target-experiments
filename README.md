Example NPM modules that integrate with PWA Studio projects and enhance them.

## Installation

1. Clone this repository

2. Run `yarn` in repository root

3. `cd` to the package in this repo that you want to try, and `yarn link` it:
   ```sh
   $ cd packages/apply-webpack-plugin && \
     yarn link
   ```

4. Now that the package is available in the global context, `cd` to your PWA project and link the package into there:
   ```sh
   $ cd ~/projects/my-pwa && \
     yarn link @magento-research/pwa-experiment-apply-webpack-plugin

5. Your PWA normally only runs targets from its explicitly declared dependencies. Add this experiment using the `BUILDBUS_DEPS_ADDITIONAL` environment variable. Specify it at the command line, or put it in your `.env` file:
   ```sh
   BUILDBUS_DEPS_ADDITIONAL=@magento-research/pwa-experiment-apply-webpack-plugin
   ```

6. Run `yarn run build` in your PWA directory. The extension will take effect!

## Roadmap

I wanna add:
- Inject CSP into UPWARD file
- New color scheme
- Modify HtmlWebpackPlugin output
- Add TypeScript loading / parsing
- Apollo Client config extension
