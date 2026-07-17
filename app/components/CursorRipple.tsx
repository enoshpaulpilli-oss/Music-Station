"use client";

import { useEffect, useRef, useState } from "react";


const symbols = [
  "♪",
  "♫",
  "♩",
  "♬",
  "✦",
];


type Note = {
  id:number;
  x:number;
  y:number;
  symbol:string;
};



export default function CursorRipple() {


  const cursorRef = useRef<HTMLDivElement>(null);


  const mouse = useRef({
    x:0,
    y:0
  });



  const [notes,setNotes] = useState<Note[]>([]);



  useEffect(()=>{


    const move = (e:MouseEvent)=>{

      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

    };



    window.addEventListener(
      "mousemove",
      move
    );



    let animation:number;


    const animate = ()=>{


      if(cursorRef.current){

        cursorRef.current.style.transform =
        `
        translate(
        ${mouse.current.x - 8}px,
        ${mouse.current.y - 8}px
        )
        `;

      }


      animation =
      requestAnimationFrame(animate);

    };


    animate();



    const click = (e:MouseEvent)=>{


      const note = {

        id:Date.now(),

        x:e.clientX,

        y:e.clientY,

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

        setNotes(prev=>
          prev.filter(
            n=>n.id!==note.id
          )
        );

      },1200);


    };



    window.addEventListener(
      "click",
      click
    );



    return()=>{

      cancelAnimationFrame(animation);

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


      {/* Smooth cursor */}

      <div
  ref={cursorRef}

  className="
  pointer-events-none
  fixed
  z-[99999]

  h-3
  w-3

  rounded-full

  bg-purple-200

  shadow-[0_0_12px_rgba(168,85,247,0.8)]

  after:absolute
  after:-inset-3

  after:rounded-full

  after:bg-purple-400/20

  after:blur-md

  after:content-['']
  "

/>



      {/* Musical particles */}

      {
        notes.map(note=>(

          <span

            key={note.id}

            className="
            pointer-events-none

            fixed

            z-[9998]

            text-3xl

            text-purple-300

            animate-note
            "

            style={{

              left:note.x,

              top:note.y

            }}

          >

            {note.symbol}

          </span>

        ))
      }


    </>
  );
}