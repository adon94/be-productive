import {
  ButtonHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Range } from "react-quill";

type Props = {
  close: () => void;
  filtered: null | string;
  setFiltered: (arg: string | null) => void;
  addToDo: (range: Range) => void;
  visible: boolean;
};

function MenuItem(props: ButtonHTMLAttributes<HTMLElement>) {
  return (
    <button
      className="w-full block px-4 py-2 mr-6 text-lg text-left dark:text-gray-50 font-mono
        group focus:bg-primary focus:outline-none"
      role="menuitem"
      tabIndex={-1}
      {...props}
    >
      {props.children}
      <span className="opacity-0 group-focus:opacity-100 w-5 h-5 float-right">
        ⏎
      </span>
    </button>
  );
}

export default function ShortMenu({
  // addToDo,
  close,
  visible,
  filtered,
  setFiltered,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const focus = useRef(0);
  const [showHelp, setShowHelp] = useState(false);

  function shiftFocus() {
    const firstItem = menuRef?.current?.children[focus.current] as HTMLElement;
    firstItem?.focus();
  }

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (menuRef?.current) {
        const length = menuRef.current.children.length;
        if (visible && menuRef && menuRef.current) {
          console.log("visible");
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              if (focus.current !== length - 1) focus.current += 1;
              else focus.current = 0;
              shiftFocus();
              break;
            case "ArrowUp":
              e.preventDefault();
              if (focus.current !== 0) focus.current -= 1;
              else focus.current = length - 1;
              shiftFocus();
              break;
            case "Escape":
              e.preventDefault();
              console.log("esc");
              window.document.onkeydown = null;
              close();
              break;
            default:
              break;
          }
        }
      }
    },
    [close, visible]
  );

  useEffect(() => {
    if (visible && menuRef && menuRef.current) {
      const firstItem = menuRef.current.children[0] as HTMLElement;
      firstItem?.focus();
      setTimeout(() => {
        window.document.onkeydown = onKeyDown;
      }, 100);
    }
    return () => {
      window.document.onkeydown = null;
    };
  }, [visible, onKeyDown]);

  function filterToDos() {
    const editorEl = window.document.querySelector(".ql-editor");
    if (editorEl?.classList.contains("hidden-mind")) {
      editorEl.classList.remove("hidden-mind");
      setFiltered(null);
    } else {
      editorEl?.classList.add("hidden-mind");
      setFiltered("actionable");
    }
    close();
  }

  return (
    <div
      className="fixed w-full h-full flex justify-center items-center bg-black bg-opacity-50"
      // onClick={close}
    >
      {!showHelp ? (
        <div
          className="z-10
        bg-main border-primary rounded-md
        ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div
            className="py-0 flex flex-col overflow-hidden"
            role="none"
            ref={menuRef}
          >
            {/* <MenuItem onClick={addToDo} id="menu-item-0">
              To do
            </MenuItem> */}
            <MenuItem onClick={filterToDos} id="menu-item-1">
              {filtered === "actionable"
                ? "Remove filters"
                : "Filter Actionable"}
            </MenuItem>
            <MenuItem onClick={() => setShowHelp(true)} id="menu-item-2">
              Help...
            </MenuItem>
            <MenuItem onClick={close} id="menu-item-3">
              Exit
            </MenuItem>
          </div>
        </div>
      ) : (
        <div
          className="w-2/3 border bg-main
            border-primary text-lg p-10 font-mono"
        >
          Mind Drop is designed to be used without a mouse.
          <br />
          <br />
          Try these shortcuts:
          <br />
          <br />
          <ul className="px-2 shortcuts">
            <li>
              <b>[cmd+.]</b> - Show Menu
            </li>
            {/* <li>
              <b>cmd+s</b> - save locally (saves automatically after 3 seconds)
            </li> */}
            <li>
              <b>[cmd+d]</b> - Toggle Darkmode
            </li>
            <li>
              <b>[cmd+g]</b> - Add Highlighted Text to Google Calendar
            </li>
            <li>
              <b>[esc]</b> - Back to Writing
            </li>
            <br />
            <li>
              start a newline with <b>[&gt;+space]</b> to create an action item.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
