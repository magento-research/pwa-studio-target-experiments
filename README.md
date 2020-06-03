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

Now that this repository's code is running in your PWA, it's time to review the concepts of PWA Studio Targets, and then explore the example modules and what features they demonstrate.

## Walkthrough

### Each package demos a concept and a possibility. Walk through them in order

#### upward-csp

##### It demos:

-   access to webpack internals
-   upward extensibility
-   what you get from adding new targets

##### Demo it

1. Look at the files (not intercept-upward-target.js yet)
2. In your Studio dir, add BUILDPACK_DEPS_ADDITIONAL=etc
3. Full build and stage
4. Whee!

##### Pairing with core contribution

1. Lotsa boilerplate right now
2. UPWARD mods are common, it should be a higher-level target
3. Link to draft PR!
4. In your Studio dir, check out draft PR branch
5. Change your package.json intercept to use intercept-upward-target.js instead

#### venia-color-scheme

##### It demos:

-   Adding another transform type
-   Using color math and CSS vars
-   Declaring your OWN targets!

##### Demo it

1. Look files
2. Check out PWA Studio branch with style changes
3. Add DEPS_ADDL
4. Watch
5. Change preferred scheme (Chrome, FF, etc) OR wait until nighttime
6. omg
7. Use color overrides target

##### Pairing with core contribution

1. Gotta fix that CSS, stay tuned, styleguide

#### nextjs-routes

##### It demos:

-   Adding routes
-   Using Targets to build higher-level convenience APIs
-   Borrowing concepts from other frameworks
-   Bonus: Markdown???

##### Demo it

1. Look files
2. Make pages OR check out PWA Studio branch with pages
3. Link to gist or draft PR?
4. Add DEPS_ADDL
5. Watch, whee!

##### Pairing w/ core contribution?

#### contentful-blog

##### It demos:

-   Adding visual items
-   Changing API clients
-   Content syndication!!!

##### Demo it

1. Look files
2. Check out branch with add'l targets
3. Add DEPS_ADDL
4. Either make your own starter-gatsby-blog or use my public one (heroku?)

##### Pairing w/ core contribution?

1. Apollo links should be customizeable
2. Adding an additional GQL API is maybe common
3. Does the split point link make sense?
4. Schema stitching instead?

## Concepts

### Extensions

PWA Studio extensions are very similar to [Webpack plugins](https://v4.webpack.js.org/api/plugins/), in that they use [Tapables][tapable] as individual extension points, to "hook in" to other parts of the framework.

The big difference between the PWA Studio extension system and Webpack plugins is in how a project uses them. Webpack is designed for developers, so the way to add Webpack plugins is to manually install them with NPM, and then manually edit Webpack's JavaScript configuration file to add them.

PWA Studio is designed for developers, sysadmins, and business users to customize, so it works a little bit more automatically. Instead of editing code, you can add and activate a PWA Studio extension in one step: by installing it with your package manager (NPM or Yarn). Buildpack, the PWA Studio toolkit, detects which installed packages are PWA Studio extensions, then automatically runs their code. After installing an extension with one command, e.g. `npm install @magento/pagebuilder`, a PWA project will integrate the new feature into the storefront with no additional work required .

This works a lot like [Magento Commerce](https://magento.com/), the backend server for PWA Studio apps. If you make an extension for Magento which enhances its backend API and requires frontend changes as well, you can make a Composer package for the former and an NPM package for the latter; each will install and activate in one step.

But when PWA Studio detects and runs extension code, what does that code do? It connects to the rest of your project using Targets.

### Targets

The Target is a low-level extensibility "primitive". It's a building block for extension functionality. More detail can be found in the developer documentation for PWA Studio, but it's time for a quick review.

A Target is an enhanced [Tapable][tapable]. It's an object that an NPM module declares and uses to expose a part of its functionality to third-party code, via the interceptor pattern.

An NPM package becomes a _PWA Studio extension_ when it _declares_ Targets, then _calls_ those targets in its own code. Those targets become available for all other PWA Studio code to _intercept_, via the Buildpack BuildBus.

#### When Targets are used

Targets run in NodeJS, in a few scripts but primarily in the build process. To invoke Targets, Buildpack creates a BuildBus object. That object runs the Target lifecycle in a prescribed order:

1. **Declare**
    1. BuildBus scans all installed extensions for declared Targets.
    2. Extensions which declare Targets have a _declare file_, a NodeJS script
2. **Intercept**: BuildBus scans all installed extensions for

Targets don't run on the storefront. They run at build time and can _change_ the code that runs the storefront, but they are designed to resolve extension logic at build time in NodeJS, so they don't impose any performance cost at build time.

#### What Targets do

Targets run their interceptors in order when they are _called_. An extension first declares a target, then gives it functionality by _calling_ that Target at some point in its code.

**Scenario**: You're the author of an extension called `@you/share-product`. It's a React component which turns product details into a menu of share buttons for social media sites. It's meant to be used on the Product Detail Page.

##### lib/menu.js

```js
import React from 'react';
import { Facebook, Twitter } from 'react-social-sharing';

export const ShareMenu = ({ product }) => (
    <aside>
        <h2>
            Share <em>{product.name}</em>:
        </h2>
        <Facebook link={product.canonical_url} />
        <Twitter message={product.name} link={product.canonical_url} />
    </aside>
);
```

Now, you need to import it into

##### lib/icons-list.json

```json
[{}]
```

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
