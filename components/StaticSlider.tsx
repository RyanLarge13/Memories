import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";

const StaticSlider = ({
  images,
  setImages,
  coverIndex,
  setCoverIndex,
}: {
  images: File[];
  setImages: Dispatch<SetStateAction<File[]>>;
  coverIndex: number;
  setCoverIndex: Dispatch<SetStateAction<number>>;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTriggered, setDragStartTriggered] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    setDragOffsetX(x);
    setDragOffsetY(y);
    setDragStartTriggered(true);
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!dragStartTriggered) {
      return;
    }

    const deltaX = e.clientX - dragOffsetX;
    const deltaY = e.clientY - dragOffsetY;

    if (!isDragging) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setIsDragging(true);
      } else {
        return;
      }
    }

    if (imageContainerRef.current && isDragging) {
      const children = imageContainerRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLImageElement;
        if (child.tagName === "IMG") {
          child.style.transform = `translateX(${
            e.clientX -
            dragOffsetX -
            imageContainerRef.current.getBoundingClientRect().width *
              currentIndex
          }px)`;
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    const deltaX = e.clientX - dragOffsetX;
    if (isDragging) {
      let sign = 1;
      if (deltaX < -75) {
        if (currentIndex < images.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          sign = 1;
        }
      } else if (deltaX > 75) {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          sign = -1;
        }
      }
      if (imageContainerRef.current) {
        setDragOffsetX(
          imageContainerRef.current.getBoundingClientRect().width *
            currentIndex +
            sign
        );
      }
    }
    setDragStartTriggered(false);
    setDragOffsetX(0);
    setIsDragging(false);
    resetSwipe();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLImageElement>) => {
    console.log("Cancel", e);
    setDragStartTriggered(false);
    setDragOffsetX(0);
    setIsDragging(false);
    setCurrentIndex(currentIndex);
  };

  const resetSwipe = () => {
    if (imageContainerRef.current) {
      const children = imageContainerRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLImageElement;
        if (child.tagName === "IMG") {
          child.style.transform = `translateX(${-(
            currentIndex *
            imageContainerRef.current.getBoundingClientRect().width
          )}px)`;
        }
      }
    } else {
    }
  };

  return (
    <div
      ref={imageContainerRef}
      style={{ touchAction: "pan-y" }}
      className="flex relative touch-none justify-start items-center overflow-hidden rounded-md shadow-lg"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {images.length > 1 && currentIndex !== images.length - 1 ? (
        <div
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === images.length - 1 ? prev : prev + 1
            )
          }
          className="absolute z-10 right-0 top-0 bottom-0 p-2 flex justify-center items-center bg-black opacity-0 hover:opacity-25 duration-300 hover:text-white text-xl font-bold rounded-md"
        >
          <FaArrowRight />
        </div>
      ) : null}
      {currentIndex > 0 ? (
        <div
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="absolute z-10 left-0 top-0 bottom-0 p-2 flex justify-center items-center bg-black opacity-0 hover:opacity-25 duration-300 hover:text-white text-xl font-bold rounded-md"
        >
          <FaArrowLeft />
        </div>
      ) : null}
      {images.map((image: File, index: number) => (
        <>
          <button
            type="button"
            onClick={() =>
              setImages((prev) => prev.filter((img) => img !== img))
            }
            className="absolute z-10 top-3 right-3 text-red-400 text-xl"
          >
            <FaTrash />
          </button>
          <button
            type="button"
            className={`rounded-md duration-200 shadow-md py-2 text-center absolute z-10 bottom-3 left-3 right-3 ${
              index === coverIndex ? "bg-green-300" : "bg-sky-300"
            }`}
            onClick={() => setCoverIndex(index)}
          >
            {index === coverIndex ? "Cover Photo" : "Set As Cover"}
          </button>
          <img
            draggable={false}
            key={index}
            src={URL.createObjectURL(image)}
            alt={`${image}`}
            style={{
              transform: imageContainerRef.current
                ? `translateX(${-(
                    currentIndex *
                    imageContainerRef.current.getBoundingClientRect().width
                  )}px)`
                : `none`,
            }}
            className="object-cover w-full h-full aspect-square rounded-lg shadow-md duration-300 select-none"
          />
        </>
      ))}
      <div className="absolute bottom-0 right-0 left-0 py-2 px-3 flex justify-start items-center gap-3">
        {images.map((_, index: number) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-slate-700"
            } duration-300`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StaticSlider;
