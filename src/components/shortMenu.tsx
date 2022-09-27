import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  addToDo: () => void;
};

export default function ShortMenu({ addToDo }: Props) {
  const firstRef = useRef<any>(null);
  const [focus, setFocus] = useState(0);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    console.log(e.key);
    if (firstRef && firstRef.current) {
      if (e.key == "ArrowDown") {
        firstRef.current.children[focus + 1].focus();
        setFocus((current) => current + 1);
        console.log("fcus", focus);
      }
    }
  }, []);

  useEffect(() => {
    if (firstRef && firstRef.current) {
      firstRef.current.children[0].focus();
      window.document.onkeydown = onKeyDown;
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen mx-auto h-screen flex justify-center items-center">
      <div
        className="z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none" ref={firstRef}>
          <button
            onClick={addToDo}
            className="text-gray-700 block px-4 py-2 text-sm"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-0"
          >
            Actionable
          </button>
          <a
            href="#"
            className="text-gray-700 block px-4 py-2 text-sm"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-1"
          >
            Support
          </a>
          <a
            href="#"
            className="text-gray-700 block px-4 py-2 text-sm"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-2"
          >
            License
          </a>
          <form method="POST" action="#" role="none">
            <button
              type="submit"
              className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
              role="menuitem"
              tabIndex={-1}
              id="menu-item-3"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
      {/* <div className="h-2/3 w-2/3 font-mono bg-red-600 dark:bg-blue-700 text-lg border-2 p-10">
        Hotkeys:
        <ul>
          <li>cmd+h - show hotkeys window</li>
          <li>cmd+s - save locally</li>
          <li>cmd+d - toggle darkmode</li>
          <li>cmd+g - add highlighted text to Google Calendar</li>
          <li>cmd+. - show only actionable items</li>
          <li>
            (Start a newline with - and a space to create an actionable item)
          </li>
          <li>esc - close this window</li>
        </ul>
      </div> */}
    </div>
  );
}
