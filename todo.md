## bugs

- [x] the svg icons does not appear in download or open mode
  - reason: svg string does not contain svg files
- [ ] in () => table, add `port` to cells
- [ ] in () => table, add styling at least for the table
- [x] in () => table, adds `,` between `td`s
- [x] in () => table, !/url become image=.. instead of <img>
- [ ] in () => table, maybe to have ()() like record shape.
- [ ] change image size to 2mm and use imagescale
- [x] isolate innerSvg styles from each other (PubSub and Cloud-Run)
- [x] change select-example <input> to <select>

## features

- [#TODO] dot to dot_json and from that
  - arrow and edges (lhead, dir=back)
  - classes
  - themes
- [ ] from dot_json to svg

- [ ] work on record-based shapes
- [x] export to pure DOT notation
- [ ] adding classes
- [x] variables
- [ ] themes
- [x] ports for table <port>
- [ ] parental arrows lhead = _ or ltail = _
- [ ] class (a.b)
- [ ] table attributes ().`attributes`
- [ ] theme through subgraph theme_x
- [ ] import through !import
- [ ] print DOT in json format
