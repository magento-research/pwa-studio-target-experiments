Example NPM modules that integrate with PWA Studio projects and enhance them.

# PWA Studio Target Experiments

This repository is a collection of experimental PWA Studio extensions. Use it to learn about how such extensions are built and used.

-   If you want to make PWA Studio extensions, this project is for you.
-   If you want to build stores with PWA Studio and use extensions, this project is for you.
-   If you want to open an issue about PWA Studio extensions, go to the [PWA Studio repository issues page](https://github.com/magento/pwa-studio).
-   If you have general questions or comments about Magento PWAs, visit us at the [community Slack channel](slack.pwastudio.io) or go to the [Developer Documentation site](pwastudio.io).
-   If you want to do something else, then I don't know why you're here, but you could go look at [people dancing to Steely Dan](https://twitter.com/steelydance), or go play the legendary 1993 video game [Star Control 2](http://sc2.sourceforge.net/). _Vaya con dios._

## Extensions

PWA Studio extensions are very similar to [Webpack plugins](https://v4.webpack.js.org/api/plugins/), in that they use [Tapables](https://github.com/webpack/tapable) as individual extension points, to "hook in" to other parts of the framework.

The big difference between the PWA Studio extension system and Webpack plugins is in how a project uses them. Webpack is designed for developers, so the way to add Webpack plugins is to manually install them with NPM, and then manually edit Webpack's JavaScript configuration file to add them.

PWA Studio is designed for developers, sysadmins, and business users to customize, so it works a little bit more automatically. Instead of editing code, you can add and activate a PWA Studio extension in one step: by installing it with your package manager (NPM or Yarn). Buildpack, the PWA Studio toolkit, detects which installed packages are PWA Studio extensions, then automatically runs their code. After installing an extension with one command, e.g. `npm install @magento/pagebuilder`, a PWA project will integrate the new feature into the storefront with no additional work required.

This works a lot like [Magento Commerce](https://magento.com/), the backend server for PWA Studio apps. If you make an extension for Magento which enhances its backend API and requires frontend changes as well, you can make a Composer package for the former and an NPM package for the latter; each will install and activate in one step.

But when PWA Studio detects and runs extension code, what does that code do? It connects to the rest of your project using Targets.

## Targets

The Target is a low-level extensibility "primitive". It's a building block for extension functionality

# Setup

## You're a core contributor. Have a copy of PWA Studio in a sibling directory

## Link em all and have two terminals going

# Walkthrough

## Each package demos a concept and a possibility. Walk through them in order

### upward-csp

#### It demos:

-   access to webpack internals
-   upward extensibility
-   what you get from adding new targets

#### Demo it

1. Look at the files (not intercept-upward-target.js yet)
2. In your Studio dir, add BUILDPACK_DEPS_ADDITIONAL=etc
3. Full build and stage
4. Whee!

#### Pairing with core contribution

1. Lotsa boilerplate right now
2. UPWARD mods are common, it should be a higher-level target
3. Link to draft PR!
4. In your Studio dir, check out draft PR branch
5. Change your package.json intercept to use intercept-upward-target.js instead

### venia-color-scheme

#### It demos:

-   Adding another transform type
-   Using color math and CSS vars
-   Declaring your OWN targets!

#### Demo it

1. Look files
2. Check out PWA Studio branch with style changes
3. Add DEPS_ADDL
4. Watch
5. Change preferred scheme (Chrome, FF, etc) OR wait until nighttime
6. omg
7. Use color overrides target

#### Pairing with core contribution

1. Gotta fix that CSS, stay tuned, styleguide

### nextjs-routes

#### It demos:

-   Adding routes
-   Using Targets to build higher-level convenience APIs
-   Borrowing concepts from other frameworks
-   Bonus: Markdown???

#### Demo it

1. Look files
2. Make pages OR check out PWA Studio branch with pages
3. Link to gist or draft PR?
4. Add DEPS_ADDL
5. Watch, whee!

#### Pairing w/ core contribution?

### contentful-blog

#### It demos:

-   Adding visual items
-   Changing API clients
-   Content syndication!!!

#### Demo it

1. Look files
2. Check out branch with add'l targets
3. Add DEPS_ADDL
4. Either make your own starter-gatsby-blog or use my public one (heroku?)

#### Pairing w/ core contribution?

1. Apollo links should be customizeable
2. Adding an additional GQL API is maybe common
3. Does the split point link make sense?
4. Schema stitching instead?

---

## Installation

1. Clone this repository

2. Run `yarn` in repository root

3. `cd` to the package in this repo that you want to try, and `yarn link` it:

    ```sh
    $ cd packages/secret-js-banner && \
      yarn link
    ```

4. Now that the package is available in the global context, `cd` to your PWA project and link the package into there:

    ```sh
    $ cd ~/projects/my-pwa && \
      yarn link @magento-research/pwa-experiment-secret-js-banner

    ```

5. Your PWA normally only runs targets from its explicitly declared dependencies. Add this experiment using the `BUILDBUS_DEPS_ADDITIONAL` environment variable. Specify it at the command line, or put it in your `.env` file:

    ```sh
    BUILDBUS_DEPS_ADDITIONAL=@magento-research/pwa-experiment-secret-js-banner
    ```

6. Run `yarn run build` in your PWA directory. The extension will take effect!

## More extension ideas

-   Tap the very extensible HtmlWebpackPlugin!
    -   You get it from the compiler or compilation instance, check the docs
    -   Would need to refactor Buildpack and Venia to move the plugin use out of the main project into utility methods
    -   Could add metadata, inline styles, or even template code to be evaluated by UPWARD
-   Generalize the concept of appending JSX nodes so there's less boilerplate
-   Make a declarative layer for common, low-logic interceptors
    -   An XML file or JSON in an additional package.json property on `"pwa-studio"`
    -   `envVarDefinitions`, `specialFeatures`, `routes`, `navItems`, anything with an array to be pushed into
-   Checkout stuff
    -   Custom renderers for payment methods
    -   Shipping estimators and tax estimators
    -   Store locators

## Future goodies for this repo

-   `.vscode` and `.idea` folders for debug configurations and tasks
-   `dotenv` for local configurations
-   Publishing instructions and best practices
-   Demo of Marketplace integration TBD
