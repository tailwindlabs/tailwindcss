export function Community() {
  return (
    <ul className="grid sm:grid-cols-2 gap-6 xl:gap-8">
      <li>
        <a
          href="https://github.com/tailwindlabs/tailwindcss/discussions"
          className="flex items-start space-x-4"
        >
          <svg fill="currentColor" className="flex-none text-gray-900 w-12 h-12">
            <rect width="48" height="48" rx="12" />
            <path
              d="M23.997 12a12 12 0 00-3.792 23.388c.6.12.816-.264.816-.576l-.012-2.04c-3.336.72-4.044-1.608-4.044-1.608-.552-1.392-1.332-1.764-1.332-1.764-1.08-.744.084-.72.084-.72 1.2.084 1.836 1.236 1.836 1.236 1.08 1.824 2.808 1.296 3.492.996.12-.78.42-1.308.756-1.608-2.664-.3-5.46-1.332-5.46-5.928 0-1.32.468-2.388 1.236-3.228a4.32 4.32 0 01.12-3.168s1.008-.324 3.3 1.224a11.496 11.496 0 016 0c2.292-1.56 3.3-1.224 3.3-1.224.66 1.644.24 2.88.12 3.168.768.84 1.236 1.92 1.236 3.228 0 4.608-2.808 5.616-5.484 5.916.432.372.816 1.104.816 2.22l-.012 3.3c0 .312.216.696.828.576A12 12 0 0023.997 12z"
              fill="currentColor"
              className="text-gray-50"
            />
          </svg>
          <div className="flex-auto">
            <h3 className="font-bold text-gray-900">GitHub Discussions</h3>
            <p>Connect with members of the Tailwind CSS community.</p>
          </div>
        </a>
      </li>
      <li>
        <a href="/discord" className="flex items-start space-x-4">
          <svg fill="currentColor" className="flex-none text-indigo-400 w-12 h-12">
            <rect width="48" height="48" rx="12" />
            <path
              d="M21.637 23.57c-.745 0-1.332.653-1.332 1.45 0 .797.6 1.45 1.332 1.45.744 0 1.332-.653 1.332-1.45.013-.797-.588-1.45-1.332-1.45zm4.767 0c-.744 0-1.332.653-1.332 1.45 0 .797.6 1.45 1.332 1.45.745 0 1.332-.653 1.332-1.45 0-.797-.587-1.45-1.332-1.45z"
              fill="currentColor"
              className="text-indigo-50"
            />
            <path
              d="M32.75 12.613H15.248a2.684 2.684 0 00-2.678 2.69v17.66a2.684 2.684 0 002.678 2.69h14.811l-.692-2.416 1.672 1.554 1.58 1.463 2.809 2.482V15.304a2.684 2.684 0 00-2.678-2.69zm-5.042 17.058s-.47-.561-.862-1.058c1.711-.483 2.364-1.554 2.364-1.554-.535.353-1.045.6-1.502.77a8.591 8.591 0 01-1.894.562 9.151 9.151 0 01-3.383-.013 10.964 10.964 0 01-1.92-.561 7.652 7.652 0 01-.953-.445c-.04-.026-.078-.039-.117-.065-.027-.013-.04-.026-.053-.039-.235-.13-.365-.222-.365-.222s.627 1.045 2.285 1.541c-.392.497-.875 1.084-.875 1.084-2.886-.091-3.983-1.985-3.983-1.985 0-4.206 1.88-7.615 1.88-7.615C20.211 18.661 22 18.7 22 18.7l.131.157c-2.35.679-3.435 1.71-3.435 1.71s.287-.156.77-.378c1.398-.614 2.508-.784 2.965-.823.079-.013.144-.026.223-.026a10.647 10.647 0 016.57 1.228s-1.033-.98-3.253-1.66l.183-.208s1.79-.04 3.67 1.371c0 0 1.881 3.41 1.881 7.615 0 0-1.11 1.894-3.997 1.985z"
              fill="currentColor"
              className="text-indigo-50"
            />
          </svg>
          <div className="flex-auto">
            <h3 className="font-bold text-gray-900">Discord</h3>
            <p>Join our Discord group to chat with other Tailwind users.</p>
          </div>
        </a>
      </li>
      <li>
        <a href="https://twitter.com/tailwindcss" className="flex items-start space-x-4">
          <svg fill="currentColor" className="flex-none text-light-blue-400 w-12 h-12">
            <rect width="48" height="48" rx="12" />
            <path
              d="M37.127 15.989h-.001a11.04 11.04 0 01-3.093.836 5.336 5.336 0 002.37-2.932 10.815 10.815 0 01-3.421 1.284 5.42 5.42 0 00-3.933-1.679c-2.976 0-5.385 2.373-5.385 5.3-.003.406.044.812.138 1.207a15.351 15.351 0 01-11.102-5.54 5.235 5.235 0 00-.733 2.663c0 1.837.959 3.461 2.406 4.413a5.338 5.338 0 01-2.449-.662v.066c0 2.57 1.86 4.708 4.32 5.195a5.55 5.55 0 01-1.418.186c-.34 0-.68-.033-1.013-.099.684 2.106 2.676 3.637 5.034 3.68a10.918 10.918 0 01-6.69 2.269 11.21 11.21 0 01-1.285-.077 15.237 15.237 0 008.242 2.394c9.918 0 15.337-8.077 15.337-15.083 0-.23-.006-.459-.017-.683a10.864 10.864 0 002.686-2.746l.007.008z"
              fill="currentColor"
              className="text-light-blue-50"
            />
          </svg>
          <div className="flex-auto">
            <h3 className="font-bold text-gray-900">Twitter</h3>
            <p>Follow the Tailwind Twitter account for news and updates.</p>
          </div>
        </a>
      </li>
      <li>
        <a href="https://www.youtube.com/tailwindlabs" className="flex items-start space-x-4">
          <svg fill="currentColor" className="flex-none text-red-500 w-12 h-12">
            <rect width="48" height="48" rx="12" />
            <path
              d="M36.83 18.556c0-2.285-1.681-4.124-3.758-4.124a184.713 184.713 0 00-8.615-.182h-.914c-2.925 0-5.799.05-8.612.183-2.072 0-3.753 1.848-3.753 4.133A75.6 75.6 0 0011 23.99a78.487 78.487 0 00.173 5.429c0 2.285 1.68 4.139 3.753 4.139 2.955.137 5.987.198 9.07.192 3.087.01 6.11-.054 9.069-.193 2.077 0 3.758-1.853 3.758-4.138.121-1.813.177-3.62.172-5.434a73.982 73.982 0 00-.165-5.428zM21.512 28.97v-9.979l7.363 4.987-7.363 4.992z"
              fill="currentColor"
              className="text-red-50"
            />
          </svg>
          <div className="flex-auto">
            <h3 className="font-bold text-gray-900">YouTube</h3>
            <p>Watch screencasts and feature tutorials of Tailwind.</p>
          </div>
        </a>
      </li>
    </ul>
  )
}
