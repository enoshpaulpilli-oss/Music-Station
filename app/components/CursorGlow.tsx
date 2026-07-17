"use client";

import { useEffect, useRef, useState } from "react";


const symbols = [
  "♪",
  "♫",
  "♩",
  "♬",
];


type Note = {
  id: number;
  x: number;
  y: number;
  symbol: string;
};


export default function CursorRipple() {


  const cursorRef = useRef<HTMLDivElement>(null);


  const mouse = useRef({
    x: 0,
    y: 0,
  });


  const [notes, setNotes] = useState<Note[]>([]);



  useEffect(() => {


    const move = (e: MouseEvent) => {

      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

    };



    window.addEventListener(
      "mousemove",
      move
    );



    let frame:number;



    const animate = () => {


      if(cursorRef.current){

        cursorRef.current.style.transform =
        `
        translate(
        ${mouse.current.x - 6}px,
        ${mouse.current.y - 6}px
        )
        `;

      }


      frame = requestAnimationFrame(animate);

    };


    animate();



    const click = (e:MouseEvent)=>{


      const note:Note = {

        id: Date.now(),

        x: e.clientX,

        y: e.clientY,

        symbol:
        symbols[
          Math.floor(
            Math.random()*symbols.length
          )
        ]

      };



      setNotes(prev=>[
        ...prev,
        note
      ]);



      setTimeout(()=>{


        setNotes(prev =>
          prev.filter(
            item => item.id !== note.id
          )
        );


      },1500);


    };



    window.addEventListener(
      "click",
      click
    );



    return()=>{


      cancelAnimationFrame(frame);


      window.removeEventListener(
        "mousemove",
        move
      );


      window.removeEventListener(
        "click",
        click
      );


    };


  },[]);





  return (

    <>


      {/* Custom Cursor */}

      <div

        ref={cursorRef}

        className="
        pointer-events-none
        fixed
        z-[99999]

        h-3
        w-3

        rounded-full

        bg-purple-300

        shadow-[0_0_20px_rgba(168,85,247,0.9)]
        "

      />




      {/* Musical Click Notes */}


      {
        notes.map((note)=>(

          <span

            key={note.id}

            className="
            pointer-events-none

            fixed

            z-[99999]

            text-xl

            text-purple-300

            animate-note
            "

            style={{

              left: note.x,

              top: note.y,

            }}

          >

            {note.symbol}

          </span>


        ))
      }



    </>

  );

}