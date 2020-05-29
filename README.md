Example NPM modules that integrate with PWA Studio projects and enhance them.

# Intro
# Setup
## You're a core contributor. Have a copy of PWA Studio in a sibling directory
## Link em all and have two terminals going
# Walkthrough
## Each package demos a concept and a possibility. Walk through them in order
### upward-csp
#### It demos:
- access to webpack internals
- upward extensibility
- what you get from adding new targets
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
- Adding another transform type
- Using color math and CSS vars
- Declaring your OWN targets!
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
- Adding routes
- Using Targets to build higher-level convenience APIs
- Borrowing concepts from other frameworks
- Bonus: Markdown???
#### Demo it
1. Look files
2. Make pages OR check out PWA Studio branch with pages
3. Link to gist or draft PR?
4. Add DEPS_ADDL
5. Watch, whee!
#### Pairing w/ core contribution?

### contentful-blog
#### It demos:
- Adding visual items
- Changing API clients
- Content syndication!!!
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

## Roadmap

I wanna add:

-   Modify HtmlWebpackPlugin output
-   Add TypeScript loading / parsing
