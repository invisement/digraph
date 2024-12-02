## bugs

- [x] the svg icons does not appear in download or open mode
  - reason: svg string does not contain svg files
- [x] in () => table, add `port` to cells
- [ ] in () => table, add styling at least for the table
- [x] in () => table, adds `,` between `td`s
- [x] in () => table, !/url become image=.. instead of <img>
- [x] in () => table, maybe to have ()() like record shape.
  - #NO
- [ ] change image size to 2mm and use imagescale
- [x] isolate innerSvg styles from each other (PubSub and Cloud-Run)
- [x] change select-example <input> to <select>

## investigate

- [ ] viz.js has a format called svg-inline. It might be good for png with inner
      svg saving

## features

- [x] dot to Graph to SVG and then
  - [ ] arrow and edges (lhead, dir=back)
  - [ ] classes
  - [ ] themes
  - [ ] parental arrows lhead = _ or ltail = _

- [x] work on record-based shapes
- [x] export to pure DOT notation
- [x] variables
- [x] ports for table <port>
- [ ] class (a.b)
- [ ] table attributes ().`attributes`
- [ ] theme through subgraph theme_x
- [ ] import through !import
- [x] print DOT in json format
