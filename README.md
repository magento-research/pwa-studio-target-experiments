# PWA Studio Target Experiments

This repository is a collection of experimental PWA Studio extensions. Use it to learn about how such extensions are built and used.

-   If you want to make PWA Studio extensions, this project is for you.
-   If you want to build stores with PWA Studio and use extensions, this project is for you.
-   If you want to open an issue about PWA Studio extensions, go to the [PWA Studio repository issues page](https://github.com/magento/pwa-studio).
-   If you have general questions or comments about Magento PWAs, visit us at the [community Slack channel](slack.pwastudio.io) or go to the [Developer Documentation site](pwastudio.io).
-   If you want to do something else, then I don't know why you're here, but you could go look at [people dancing to Steely Dan](https://twitter.com/steelydance), or go play the legendary 1993 video game [Star Control 2](http://sc2.sourceforge.net/). _Vaya con dios._

## Setup

This repo should live in a sibling directory to your working copy of PWA Studio.
It has scripts which connect the PWA project with the extension code in these packages, much like a filesystem dependency in Composer or a linked package in NPM.

1. Clone this repository.

2. Run `yarn install` in the repository root. This repo uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces), like PWA Studio does, so this command will also install all the dependencies in `packages/`.

3. Here comes the magic! In the repository root, run `yarn studiolink </path/to/your/pwa_studio_repo>`.
   Use the _absolute path_ to your PWA Studio repo.

    ```sh
    yarn studiolink /Users/jzetlen/Projects/pwa-studio/packages/venia-concept
    ```

    All the packages in `packages` are now available to `require()` and `import` in your PWA project.
    _(From now on, if you run `yarn install` in your PWA project, you may have to re-run this command)._

4) Your PWA normally only runs targets from its explicitly declared dependencies.
   However, these modules aren't published to NPM, so if you explicitly declared one in `package.json` it would cause problems on install.
   To help with development, PWA Buildpack has a `BUILDBUS_DEPS_ADDITIONAL` environment variable.
   Specify it at the command line, or put it in your `.env` file:

    ```sh
    BUILDBUS_DEPS_ADDITIONAL=@magento-research/pwa-upward-csp,@magento-research/pwa-venia-color-scheme
    ```

    If these packages are resolvable (installed) in your project, then Buildpack will run their interceptors as if they are declare dependencies.
    In step 3, you linked all of these experiments to your PWA project, so this should work!

5) Run `yarn run watch:venia` in your PWA directory. The extensions will take effect!

6) Test your extensions: switch your computer's display settings to dark mode, for instance.

Now that this repository's code is running in your PWA, it's time to look at how they work in more detail.
If you want to review the concepts of Extensions and Targets, you can skip to [Concepts](#concepts) before continuing with the walkthrough.

## Walkthrough

Each of the example extensions here demonstrates a concept of the type of functionality that can be customized, and a pattern for doing that customization.
Some of the examples require new Targets that PWA Studio doesn't have yet! In those examples, you'll find a link to a pull request to PWA Studio, implementing these targets.

**⚠️ If an extension notes that it _requires_ new PWA Studio functionality to work, then it will cause errors if you try to run it on the `develop` branch. Instead, you can check out the branch in the linked pull request.**

### 💡Example: [Content Security Policy for Venia](github.com/magento-research/pwa-studio-target-experiments/upward-csp)

This extension for Venia modifies the Venia UPWARD definition to send [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers for all pages. It automatically adds the Magento backend as a legal source, and it relaxes the security policy in developer mode while leaving it very strict in production. It currently is in Report-Only mode, because it's experimental!

#### Demo Upward CSP

1. Make sure you have run `yarn run studiolink /path/to/pwa` in this repo root.

1. Open a terminal in `/path/to/pwa` and run:

    ```sh
    BUILDBUS_DEPS_ADDITIONAL=@magento-research/pwa-upward-csp yarn run build && \
    yarn run stage:venia
    ```

1. View staging site in browser.

1. Open your JS console and watch the report-only CSP errors pile up. In strict mode, these requests would be blocked.

#### Notes

In its code, you'll find two different implementations of the same functionality. One of them is in `intercept-upward-file.js`, and the other is in `intercept-upward-target.js`.
Out of the box, the extension uses `intercept-upward-file.js`, so look at that first.

The code in `intercept-upward-file.js` is verbose. It needs to tap Webpack directly and use very generic module interceptors to find the UPWARD file in the compilation graph and manually modify it. Since UPWARD will be a very common target of customization, there should be a builtin Target to make it simpler to get to that logic.

#### Contribution

That's where the `intercept-upward-target.js` file comes in. This implementation **relies on a functionality that is currently in a [pull request to PWA Studio][pr_upward-csp]**. It adds a new Target which makes the same functionality much simpler and more maintainable, allowing us to use `intercept-upward-target.js` instead.

If you have the branch in that pull request available locally, you can run `yarn studiolink /path/to/branch` to test it out. With the branch checked out, edit `packages/upward-csp/package.json`. Change the `pwa-studio.targets.intercept` file path from `intercept-upward-file.js` to `intercept-upward-target.js` and rerun the build.

### 💡Example: [Venia Color Scheme](github.com/magento-research/pwa-studio-target-experiments/venia-color-scheme)

Venia stores its colors in CSS Variables in a global stylesheet, so that most of its component CSS is encapsulated in modules, but can use the same global color scheme.
This extension for Venia modifies the core colors of the theme.
It parses the CSS of the global stylesheet, then autogenerates a dark theme by manipulating the theme colors in the HSL color space, to preserve contrast and key colors.

#### Demo Venia Color Scheme

1. ⚠️ Have the [companion PWA Studio pull request][pr_venia-color-theme] checked out in your `/path/to/pwa` directory. **This will not work on the develop branch of PWA Studio.**

1. Make sure you have run `yarn run studiolink /path/to/pwa` in this repo root.

1. Open a terminal in `/path/to/pwa` and run:

    ```sh
    BUILDBUS_DEPS_ADDITIONAL=@magento-research/pwa-venia-color-scheme yarn watch:venia
    ```

1. View site in browser.

1. Switch between dark mode and light mode. There's no UI control; it detects your system preference.

    **Here's how to set or simulate dark mode on:**

    - [iOS](https://support.apple.com/en-us/HT210332#:~:text=To%20turn%20Dark%20Mode%20on,or%20at%20a%20specific%20time.)
    - [Android](https://www.techradar.com/how-to/how-to-enable-dark-mode-on-android-10)
    - [Google Chrome](https://stackoverflow.com/questions/57606960/how-can-i-emulate-prefers-color-scheme-media-query-in-chrome)
    - [Firefox](https://stackoverflow.com/questions/56401662/firefox-how-to-test-prefers-color-scheme)
    - [macOS](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/)
    - [Windows](https://blogs.windows.com/windowsexperience/2019/04/01/windows-10-tip-dark-theme-in-file-explorer/)

    Or, you could wait around a few hours. Time is a bitter, cosmic joke on us all.

#### Notes

This extension also declares its own target to allow the project, or other dependencies, to set overrides for certain colors.

#### Contribution

⛔️This extension **relies on a [pull request to PWA Studio][pr_venia-color-theme] to work**. This PR audits the Venia stylesheets to replace all remaining declarations with hardcoded colors. It also adds a new type of module transform to the `transformModule` target, called `postcss`! Both of these code changes are tremendously valuable to the PWA Studio core team as well as to integrators.

### 💡Example: [NextJS-Style Routes](github.com/magento-research/pwa-studio-target-experiments/nextjs-routes)

[NextJS](https://nextjs.org/) is a very popular and powerful framework for server-side-rendered React applications. It has a lot of friendly APIs and sensible organizational concepts. ~~So we thought we'd steal them~~ Some of these developer-friendly features can be brought to PWA Studio via the Targets framework.

This extension adds NextJS-style [filesystem-based route structure](https://nextjs.org/docs/routing/introduction) to a PWA Studio app. It also shows how to implement more declarative, simple and strict interfaces "on top" of the low-level Targets.

#### Demo NextJS Style Routes

1. In your PWA Studio repository, create a new folder in `packages/venia-concept/src/` called `pages`.

1. In that folder, create another folder called `compare`, and then in that folder, another folder called `[left]` (in brackets).

1. Download [these examples](https://gist.github.com/zetlen/4c3d97ae2f83f414dfa78ff1fc8b172e) and put them in these new folders. You should end up with two new files in your repo:

    ```sh
    packages/venia-concept/src/pages/hello_next.md.js
    packages/venia-concept/src/pages/compare/[left]/[right].js
    ```

1. Make sure you have run `yarn run studiolink /path/to/pwa` in this repo root.

1. Open a terminal in `/path/to/pwa` and run:

    ```sh
    BUILDBUS_DEPS_ADDITIONAL=@magento-research/pwa-nextjs-routes yarn watch:venia
    ```

1. View site in browser. Go to `/hello_next.md`.

1. Now pick two product SKUs and visit `/compare/[sku1]/[sku2]`. On a Venia store, you could use `/compare/VA12-SI-NA/VA11-GO-NA`.

#### Contribution

This extension doesn't require any additional Target work from PWA Studio itself to work in a basic way. However, a few things might improve it:

-   Better support for watch-mode dependency management in Targets
-   Better exposal of resolver functions in Targets, to determine real fs paths
-   Distinguishing between page routes and RootComponents

### 💡Example: [Contentful Blog](github.com/magento-research/pwa-studio-target-experiments/contentful-blog)

There's nothing worse than trying to put a "blog" on your web store using some "blog-lite" add-on to the commerce software. Dedicated blog platforms can't be
beat for features; if only there was a way to smoothly integrate blog content on
to your store without a jarring transition.

This extension adds blog content from [Contentful](https://www.contentful.com/),
by adding some routes and invisibly welding Magento GraphQL and Contentful GraphQL together.

It demonstrates a few potentially common uses of the Targets framework:

-   Adding visual items (the nav item, in this case)
-   Adding configuration for external integrations
-   Changing the behavior of API clients
-   Injecting third-party content

#### Demo the Contentful Blog

1. Clone the [starter-gatsby-blog](https://github.com/contentful/starter-gatsby-blog) project into a sibling directory alongside your PWA Studio folder and this repository.

1. Follow the instructions for setting up that site. Run the local development environment. When it is running locally, you can visit the localhost server to see what the content should look like. Make a note of the GraphQL endpoint logged in the terminal; it will be something like `http://localhost:8080/___graphql`

1. ⚠️ Have the [companion PWA Studio pull request][pr_content-targets] checked out in your `/path/to/pwa` directory. **This will not work on the develop branch of PWA Studio.**

1. Make sure you have run `yarn run studiolink /path/to/pwa` in this repo root.

1. Open a terminal in `/path/to/pwa` and run:

    ```sh
    CONTENTFUL_GRAPHQL_ENDPOINT=http://localhost:8080/___graphql \
    BUILDBUS_DEPS_ADDITIONAL=@magento-research/pwa-venia-color-scheme \
    yarn watch:venia
    ```

1. View site in browser.

1. Open the left nav. Observe the new nav item. Click it.

1. Watch the network tab. Note that multiple GraphQL APIs are in use.

1. Click a blog entry. Notice the slug in the URL.

1. As an extra bonus, if you want to make a Contentful account and add/modify this sample content, do so and refresh your site to prove to yourself that all this data is live!

#### Contribution

⛔️This extension **relies on a [pull request to PWA Studio][pr_content-targets] to work**. This PR adds several targets to Venia to enable a seamless integration.

-   VeniaUI has an `apolloLink` target, exposing the already composable concept of Apollo Links to PWA Studio extensions
-   VeniaUI has a `navItems` target, exposing the main navigation menu in the same way that `routes` exposes the routing table

### 💡Example: [Venia Critical CSS](github.com/magento-research/pwa-studio-target-experiments/critical-css)

_Wouldn't you like to know._

**TODO:** tell them

---

# Concepts

## Extensions

PWA Studio extensions are very similar to [Webpack plugins](https://v4.webpack.js.org/api/plugins/), in that they use [Tapables][tapable] as individual extension points, to "hook in" to other parts of the framework.

The big difference between the PWA Studio extension system and Webpack plugins is in how a project uses them. Webpack is designed for developers, so the way to add Webpack plugins is to manually install them with NPM, and then manually edit Webpack's JavaScript configuration file to add them.

PWA Studio is designed for developers, sysadmins, and business users to customize, so it works a little bit more automatically. Instead of editing code, you can add and activate a PWA Studio extension in one step: by installing it with your package manager (NPM or Yarn). Buildpack, the PWA Studio toolkit, detects which installed packages are PWA Studio extensions, then automatically runs their code. After installing an extension with one command, e.g. `npm install @magento/pagebuilder`, a PWA project will integrate the new feature into the storefront with no additional work required .

This works a lot like [Magento Commerce](https://magento.com/), the backend server for PWA Studio apps. If you make an extension for Magento which enhances its backend API and requires frontend changes as well, you can make a Composer package for the former and an NPM package for the latter; each will install and activate in one step.

But when PWA Studio detects and runs extension code, what does that code do? It connects to the rest of your project using Targets.

## Targets

The Target is a low-level extensibility "primitive". It's a building block for extension functionality. More detail can be found in the developer documentation for PWA Studio, but it's time for a quick review.

A Target is an enhanced [Tapable][tapable]. It's an object that an NPM module declares and uses to expose a part of its functionality to third-party code, via the interceptor pattern.

An NPM package becomes a _PWA Studio extension_ when it _declares_ Targets, then _calls_ those targets in its own code. Those targets become available for all other PWA Studio code to _intercept_, via the Buildpack BuildBus.

### When Targets are used

Targets run in NodeJS, in a few scripts but primarily in the build process. To invoke Targets, Buildpack creates a BuildBus object. That object runs the Target lifecycle in a prescribed order:

1. **Declare**
    1. BuildBus scans all installed extensions for declared Targets.
    1. Extensions which declare Targets have a _declare file_, a NodeJS script which exports a function.
    1. BuildBus loads the declare file and calls that function with a `TargetProvider` object, an interface to the BuildBus.
    1. The declare file should run `targets.declare(targetDictionary)` to publish Target objects so that other packages can use them.
1. **Intercept**:
    1. BuildBus scans all installed extensions for an _intercept files_.
    1. BuildBus loads the intercept file and calls it in the same way as the `declare` file, but the passed `TargetProvider` is now fully stocked with declared targets from all dependencies.
    1. The intercept file should run `targets.of(desiredDependencies)` to retrieve a dictionary of named targets, then tap those targets and pass callbacks with custom functionality.
1. **Build**:
    1. BuildBus is done scanning dependencies. The build process begins to call builtin targets (those targets declared by Buildpack itself) on BuildBus directly.
    1. Interceptors execute, in turn calling other interceptors, until the build process completes. The implementation of interceptors and the timing of the Webpack compiler object will determine what order targets are called at this point.

Targets don't run on the storefront. They run at build time and can _change_ the code that runs the storefront, but they are designed to resolve extension logic at build time in NodeJS, so they don't impose any performance cost at build time.

### What Targets do

Targets run their interceptors in order when they are _called_. An extension first declares a target, then gives it functionality by _calling_ that Target at some point in its code.

#### ⚡️Scenario: Adding a Webpack plugin

You're the author of an extension called `@you/pwa-studio-dupcheck`. You want it to add the [DuplicatePackageCheckerPlugin](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin), which detects when multiple versions of the same code are bundled into the app, and warns the developer, so they can correct the issue and reduce bundle size. This is your code.

##### apply-plugin.js

```js
const DupCheckPlugin = require('duplicate-package-checker-webpack-plugin');

function intercept(targets) {
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        const plugin = new DupCheckPlugin({ verbose: true });
        plugin.apply(compiler);
    });
}

module.exports = intercept;
```

##### package.json (excerpt)

```diff
 [...]
+"pwa-studio": {
+    "targets": {
+        "intercept": "./apply-plugin.js"
+     }
+}
```

Once a PWA project has `@you/pwa-studio-dupcheck` installed, its build process will log warnings when duplicate modules are detected!

1. The PWA project calls `Buildpack.configureWebpack(config)` in its `webpack.config.js` file.

1. In `configureWebpack()`, Buildpack creates a BuildBus.

1. The BuildBus scans installed dependencies, and and finds the `pwa-studio.targets.intercept` in the extension's `package.json` as shown above.

1. **Declare phase**: modules declare Targets. Buildpack declares its own first, including `webpackCompiler`.

1. **Intercept phase**: BuildBus calls all intercept files, including `apply-plugin.js` as shown above.

1. The extension gets the Buildpack `webpackCompiler` target and intercepts it via `.tap`, passing a synchronous callback.

1. **Run phase**: With the initialized BuildBus, Buildpack continues assembling Webpack config.

1. Webpack creates a Compiler object.

1. **Buildpack calls its own `webpackCompiler` target, passing the compiler instance.**

    ```js
    // Simplified for readability
    targets.own.webpackCompiler.call(compiler);
    ```

1. Each interceptor of `webpackCompiler` is called with the compiler object. The callback in `apply-plugin.js` runs.

1. A new `DupCheckPlugin` adds itself to the Webpack compiler instance.

#### ⚡️Scenario! Declare your own targets

Users of your `@you/pwa-studio-dupcheck` extension are loving it, but some complain that they want to hide some of the warnings. There are a few duplicates that they simply _can't_ remove, so the plugin warnings clutter up the build log, tempting them to turn the entire plugin off.

You see in `duplicate-package-checker-webpack-plugin`'s documentation that it has an option called `exclude`. You can pass an `options.exclude` function, which will be called for every duplicate. If that function returns true, the warning is not logged. That would solve this problem well!

But the project that uses `@you/pwa-studio-dupcheck` does not have access to the constructor arguments of `DupCheckPlugin`. The interceptor is hiding in a dependency.

You decide that `@you/pwa-studio-dupcheck` should declare its own target, so that other packages, including the app itself, can hide duplicate errors about certain modules.

##### declare-dup-exclude.js

```js
function declare(targets) {
    targets.declare({
        exclude: new target.types.SyncBail(['instance'])
    });
}
```

##### package.json

```diff
 [...]
 "pwa-studio": {
     "targets": {
+        "declare": "./declare-dup-exclude.js",
         "intercept": "./apply-plugin.js"
      }
 }
```

Now you've declared a Target. but it doesn't do anything yet. How do you _implement_ it?

You'll almost always call your own targets _within your interceptors of other targets_. This is how the PWA Studio extension framework builds up rich functionality out of a small number of builtin targets from Buildpack itself.

A `SyncBail` Target is one of the two types of Target which _return a value_. When you call this Target, it will call each of its interceptors with the supplied argument. If any of the interceptors return a non-undefined value, the Target "exits early", returning that value. It doesn't call the rest of the interceptors.

This makes sense for the `options.exclude` function, since if any of the interceptors return true, then the passed module should be excluded.

##### apply-plugin.js

```diff
 const DupCheckPlugin = require('duplicate-package-checker-webpack-plugin');

 function intercept(targets) {
     targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
         const plugin = new DupCheckPlugin({
+          exclude: instance => targets.own.exclude.call(instance),
           verbose: true
         });
         plugin.apply(compiler);
     });
 }

 module.exports = intercept;
```

You're using your Target as the `options.exclude` function, so it has the same API as described in the [plugin documentation](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin#configuration). Except now, you've allowed the PWA project _and_ any other extensions to decide what to exclude!

#### ⚡️Scenario: Using your new extension

1. Install it in your PWA: `yarn add --dev @you/pwa-studio-dupcheck`

1. Installed extensions activate in the next build. Run `yarn build`.

1. Uh oh! Your build logs a warning that you're using two separate versions of `lodash`! ![Stolen from the plugin readme](https://raw.githubusercontent.com/darrenscerri/duplicate-package-checker-webpack-plugin/master/screenshot.png)

1. First, you try and resolve it, using [Yarn resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions).

1. But this breaks your app! It turns out that the dependencies which require `lodash` really do require mutually incompatible versions of it. You'll address this problem later; for now, you need to control noise in the build.

1. Add to the `local-intercept.js` file in your project. (If you don't have one, set one up and list it in `package.json`).
    ```js
    targets.of('@you/pwa-studio-dupcheck').exclude.tap(instance => {
        if (instance.name === 'lodash') {
            return true;
        }
    });
    ```
1. On your next build, the `lodash` warning is quiet.

Now you've created a useful extension, intercepted a builtin Target, declared your own Target, and demonstrated that it works!

There's more to learn: you can use sync or async Targets, add special behavior to Targets via the `.intercept` meta-method, and most importantly, you can help PWA Studio out by noticing when something that should be easy in an extension system is too difficult. Fix it by opening an issue in PWA Studio and describing what you want, or even by forking PWA Studio, adding or enhancing the Target you want, and opening a pull request!

---

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

[tapable]: https://github.com/webpack/tapable
[pr_upward-csp]: https://github.com/magento/pwa-studio/pull/2459
[pr_venia-color-theme]: https://github.com/magento/pwa-studio/pull/2460
[pr_content-targets]: https://github.com/magento/pwa-studio/pull/2461
