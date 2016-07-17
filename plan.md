# Plan

* [x] Find <audio> elements

* [x] Get file URL for each

* [ ] Build custom markup
    - [x] play/pause button
    - [x] current time
    - [x] total time
    - [x] current time indicator (scrobbleable)
    - [x] artist
    - [x] track title
    - [ ] album title (?)

* [ ] Load files into buffer

* [ ] Loading indicator
    - [x] Loading is Happening
    - [ ] Incremental progress

* [ ] Sensible, user-friendly error messages

* [x] Display file details

* [ ] Get file metadata

* [x] Play specific file

* [ ] Options:
    - [ ] theme (wrapper class)
    - [ ] playlist or independent players

* [ ] Methods:
    - [ ] playFile(n) [n = file index]
    - [ ] pauseFile(n)
    - [ ] playFileFromTime(n,mmss) [mmss = minutes/seconds]
    - [ ] scrollToTime(n,mmss)
    - [ ] setVolume(d) [d = decimal volume level]
