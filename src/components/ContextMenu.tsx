import { FunctionalComponent, RefObject } from "preact";
import { useRef, useEffect } from "preact/hooks";

interface ContextMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  menuRef: RefObject<HTMLDivElement>;
  options: Array<{ label: string; onClick: () => void }>;
  onClose: () => void;
}

export const ContextMenu: FunctionalComponent<ContextMenuProps> = ({
  x,
  y,
  isVisible,
  options,
  menuRef,
  onClose,
}) => {

  useEffect(() => {
    if (isVisible) {
      menuRef.current?.focus();
    }
  }, [isVisible]);

  return (
    <div
      ref={menuRef}
      tabIndex={-1}
      role="menu"
      aria-hidden={!isVisible}
      className={`context-menu ${isVisible ? "context-menu-active" : ""}`}
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          role="menuitem"
          onClick={() => {
            option.onClick();
            onClose();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export const useClickAway = (onClickAway: () => void, isVisible: boolean) => {
  useEffect(() => {
    if (!isVisible) return;

    const handleClick = () => {
      onClickAway();
    };

    // Add a delay to prevent immediate close
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [onClickAway, isVisible]);
};
