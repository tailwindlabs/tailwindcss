<!DOCTYPE html>
<html lang="en" class="antialiased">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://unpkg.com/tailwindcss/dist/tailwind.min.css">
  <style>
    :root {
      --color-code-green: #b5f4a5;
      --color-code-yellow: #ffe484;
      --color-code-purple: #d9a9ff;
      --color-code-red: #ff8383;
      --color-code-blue: #93ddfd;
      --color-code-white: #fff;
    }
  </style>
</head>
<body style="width: 640px; height: 480px; overflow: hidden">
  <div id="app" class="p-2">
    <workflow-animation></workflow-animation>
  </div>
  <script src="{{ mix('/js/workflow-animation.js', 'assets/build') }}"></script>
</body>
</html>
