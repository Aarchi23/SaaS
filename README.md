# SaaS Dashboard Application

A modern, fast, and interactive SaaS dashboard application.
## Features

- **App Router Dashboard**
  - Overview metrics and analytics (`/dashboard/overview`)
  - Transaction history (`/dashboard/transactions`)
  - Report creation (`/dashboard/reports/create`)
- **Drag and Drop Capabilities**: Powered by `@dnd-kit` for interactive UI components.
- **State Management**: Using `zustand` for global state and `nuqs` for type-safe search parameters.
- **Styling**: Styled beautifully with Tailwind CSS v4, leveraging `clsx` and `tailwind-merge` for dynamic classes.
- **Icons**: Beautiful and consistent icons provided by `lucide-react`.
- **Testing Setup**: Configured with `vitest` and `@testing-library/react` for robust unit testing.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (v16.2.1)
- **Library**: [React](https://react.dev) (v19.2.4)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) & [nuqs](https://nuqs.47ng.com/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)

## Project Structure

```text
+-- app/
�   +-- (dashboard)/            # Dashboard layout group
�   �   +-- dashboard/
�   �       +-- overview/       # Main dashboard metrics
�   �       +-- reports/create/ # Report generation tool
�   �       +-- transactions/   # Transaction list
�   +-- layout.js               # Root layout
�   +-- page.js                 # Landing page
+-- components/                 # Reusable UI components
�   +-- ui/                     # Base design components (Company Logo, etc.)
�   +-- header.js               # Global application header
�   +-- sidebar.js              # Dashboard navigation sidebar
+-- lib/                        # Utility functions (e.g. utils.js)
```

## Getting Started

First, install the dependencies, then run the development server:

```bash
npm install
npm run dev
# or yarn, pnpm, bun equivalent
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
