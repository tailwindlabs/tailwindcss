# Tailwind CSS Documentation

## Developing

Tailwind uses the [Jigsaw](http://jigsaw.tighten.co/) static site generator for its documentation. Here is how you can generate the documentation locally:

1. Go to your Tailwind folder

    ```sh
    cd docs
    ```

2. Install JS dependencies

    ```sh
    npm install
    ```

3. Install PHP dependencies for docs (requires Composer: https://getcomposer.org)

    ```sh
    composer install
    ```

4. Run the build to generate the static site

    ```sh
    npm run dev
    ```

5. View the static site at `/build_local`, or you can run the Jigsaw server:

    ```sh
    ./vendor/bin/jigsaw serve
    ```
