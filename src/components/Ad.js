export function Ad() {
  return (
    <div id="tailwind-ui-widget">
      <a
        href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
        className="mt-3 block"
      >
        <img
          src={require('@/img/tailwind-ui-sidebar.png').default}
          alt="Tailwind UI"
          width={457}
          height={336}
        />
      </a>
      <p className="mt-4 text-gray-700">
        <a
          href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
          className="text-gray-700"
        >
          Beautiful UI components by the creators of Tailwind CSS.
        </a>
      </p>
      <div className="mt-2">
        <a
          href="https://tailwindui.com/?utm_source=tailwindcss&utm_medium=sidebar-widget"
          className="text-sm text-gray-800 font-medium hover:underline"
        >
          Learn more →
        </a>
      </div>
    </div>
  )
}
