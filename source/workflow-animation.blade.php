<!DOCTYPE html>
<html lang="en" class="antialiased">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://unpkg.com/tailwindcss@next/dist/tailwind.min.css">
  <style>
    :root {
      --color-code-green: #bdfab3;
      --color-code-yellow: #f9e189;
      --color-code-purple: #e1bbff;
      --color-code-red: #ff88ac;
      --color-code-blue: #93ddfd;
      --color-code-white: #fff;

      --color-code-green: #B5F4A5;
      --color-code-yellow: #FFE484;
      --color-code-purple: #D9A9FF;
      --color-code-red: #FF8383;
      --color-code-blue: #93DDFD;
      --color-code-white: #fff;
    }
  </style>
</head>
<body style="width: 640px; height: 448px; overflow: hidden">
  <div id="app" class="p-2">
    <workflow-animation></workflow-animation>
  </div>
  <script src="{{ mix('/js/workflow-animation.js', 'assets/build') }}"></script>
</body>
</html>
