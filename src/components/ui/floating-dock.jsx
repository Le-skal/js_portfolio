import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";

export const FloatingDock = ({ items, desktopClassName, mobileClassName }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({ items, className }) => {
  const [activeItem, setActiveItem] = useState(null);

  const handleTouchStart = (idx) => {
    setActiveItem(idx);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setActiveItem(null), 400);
  };

  const handleClick = (e, item, idx) => {
    e.preventDefault();
    setActiveItem(idx);

    setTimeout(() => {
      if (item.onClick) {
        item.onClick();
      } else if (item.href) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      }
      setActiveItem(null);
    }, 15);
  };

  return (
    <div className={cn("fixed bottom-3 left-1/2 -translate-x-1/2 z-50 block md:hidden", className)}>
      <div className="flex gap-2 items-center bg-foreground/5 backdrop-blur-xl px-3 py-2 rounded-xl border border-foreground/10">
        {items.map((item, idx) => (
          <React.Fragment key={item.title}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: activeItem === idx ? 1.4 : 1
              }}
              transition={{
                delay: idx * 0.1,
                scale: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              {item.onClick ? (
                <button
                  onClick={(e) => handleClick(e, item, idx)}
                  onTouchStart={() => handleTouchStart(idx)}
                  onTouchEnd={handleTouchEnd}
                  className={cn(
                    "h-10 w-10 rounded-full bg-foreground/10 backdrop-blur-sm",
                    "border border-foreground/20",
                    "flex items-center justify-center",
                    "transition-all duration-300",
                    activeItem === idx && "border-violet-400/50 bg-foreground/15 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  )}
                  aria-label={item.title}
                >
                  <motion.div
                    className="h-4 w-4"
                    animate={{ scale: activeItem === idx ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {item.icon}
                  </motion.div>
                </button>
              ) : (
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item, idx)}
                  onTouchStart={() => handleTouchStart(idx)}
                  onTouchEnd={handleTouchEnd}
                  className={cn(
                    "h-10 w-10 rounded-full bg-foreground/10 backdrop-blur-sm",
                    "border border-foreground/20",
                    "flex items-center justify-center",
                    "transition-all duration-300",
                    activeItem === idx && "border-violet-400/50 bg-foreground/15 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  )}
                  aria-label={item.title}
                >
                  <motion.div
                    className="h-4 w-4"
                    animate={{ scale: activeItem === idx ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {item.icon}
                  </motion.div>
                </a>
              )}
            </motion.div>
            {idx === 2 && (
              <div className="w-px h-6 bg-foreground/20" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-20 md:h-22 lg:h-24 gap-4 md:gap-5 lg:gap-6 items-end rounded-xl md:rounded-2xl bg-foreground/5 backdrop-blur-xl px-4 md:px-5 lg:px-6 pb-3 md:pb-3.5 lg:pb-4 border border-foreground/10 w-fit",
        className
      )}
    >
      {items.map((item, idx) => (
        <React.Fragment key={item.title}>
          <IconContainer mouseX={mouseX} {...item} />
          {idx === 2 && (
            <div className="w-px h-12 md:h-14 lg:h-16 bg-foreground/20 mt-5 md:mt-6 lg:mt-8 mb-0" />
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

function IconContainer({ mouseX, title, icon, href, onClick }) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [50, 90, 50]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [50, 90, 50]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [24, 45, 24]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [24, 45, 24]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="aspect-square rounded-full bg-foreground/10 backdrop-blur-sm
                 border border-foreground/20 hover:border-violet-400/50
                 flex items-center justify-center relative
                 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
                 transition-colors duration-300"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="px-2 py-0.5 whitespace-pre rounded-md bg-foreground/90 backdrop-blur-sm
                       border border-foreground/20 text-background text-xs absolute left-1/2
                       -translate-x-1/2 -top-8 w-fit"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  if (onClick) {
    return <button onClick={onClick}>{content}</button>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}
