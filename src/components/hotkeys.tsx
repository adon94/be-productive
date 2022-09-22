type Props = {
  visible: boolean;
};

export default function Hotkeys({ visible }: Props) {
  if (!visible) return <></>;
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div className="h-2/3 w-2/3 font-mono bg-red-600 dark:bg-blue-700 text-lg border-2 p-10">
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
      </div>
    </div>
  );
}
