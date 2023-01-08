import React, { useState, useEffect, useRef } from "react";
//import { TextField, ListItem, ListItemText } from "@material-ui/core/";
import { keymaps_win } from "./keymap";

interface Props {
  category: string;
  keyassign: string;
  command: string;
}

const ListItems: React.FC<Props> = (props) => (
  <tr><td className="cat">{props.category}</td><td className="key">{props.keyassign}</td><td className="cmd">{props.command}</td></tr>
);

let keymaps: string[][];
let keymaps_mac: string[][];

const SearchTextField: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [showLists, setShowLists] = useState(false);
  const [filteredKeymaps, setFilteredKeymaps] = useState(keymaps);

  const inputRef = useRef(null)

  useEffect(() => {
    keymaps_mac = keymaps_win.map((keymap) => [
        keymap[0]
       ,keymap[1].replace('Ctrl+', 'Command+').replace('Alt+', 'Option+')
       ,keymap[2]
    ])

    let os = navigator.userAgent;
    if (os.search('Mac') >= 0) {
      keymaps = keymaps_mac;
    } else {
      keymaps = keymaps_win;
    }

  }, []);

  useEffect(() => {
    if (inputRef.current) {
      const node: HTMLElement = inputRef.current;
      node.focus();
      setShowLists(true);
    }

    if (keyword === "") {
      setFilteredKeymaps(keymaps);
      return;
    }

    const searchKeywords = keyword
      .trim()
      .toLowerCase()
      .match(/[^\s]+/g);

    //入力されたキーワードが空白のみの場合
    if (searchKeywords === null) {
      setFilteredKeymaps(keymaps);
      return;
    }

    const result = keymaps.filter((keymap) =>
      searchKeywords.every((kw) => 
          (keymap[0].toLowerCase().indexOf(kw) !== -1)
       || (keymap[1].toLowerCase().indexOf(kw) !== -1)
       || (keymap[2].toLowerCase().indexOf(kw) !== -1)
      )
    );

    setFilteredKeymaps(result.length ? result : [["No Item Found"]]);
  }, [keyword]);

  return (
    <>
      <div className="datatable-container">
        <div className="header-tools">
          <div className="search">
            <input type="search" className="search-input" placeholder="Search..."
              ref={inputRef}
              onChange={(e) => setKeyword(e.target.value)}
              onClick={() => setShowLists(true)}
            />
          </div>
          <div id="app_title">ALL YOUR CUBASE ARE BELONG TO US <span id="subtitle">- Cubase Keyassign Easy Search Tool -</span></div>
        </div>        
        <table className="datatable">
          <thead>
            <tr><th id="tab_cath">CATEGORY</th><th id="tab_keyh">KEY</th><th id="tab_cmdh">COMMAND</th></tr>
          </thead>
          <tbody>
            {showLists &&
            filteredKeymaps.map((v, i) => <ListItems key={i} category={v[0]} keyassign={v[1]} command={v[2]}/>)}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SearchTextField;
