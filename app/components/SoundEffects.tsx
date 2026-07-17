"use client";


const soundFiles = {

  click: "/sounds/click.mp3",

  hover: "/sounds/hover.mp3",

  note: "/sounds/note.mp3",

};



export function playSound(
  sound: keyof typeof soundFiles
) {

  const audio = new Audio(
    soundFiles[sound]
  );


  audio.volume = 0.2;


  audio.play()
  .catch(() => {});

}