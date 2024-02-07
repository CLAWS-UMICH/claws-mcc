const [visible, setVisible] = useState(false);
<Dropdown overlay={menu} visible={visible} trigger={["contextMenu"]}>
   <Table ... />
</Dropdown>

const [posX, setPosX] = useState(0);
const [posY, setPosY] = useState(0);
const [value, setValue] = useState("");

const renderSelectedTab = () => {
    <Table
    onRow={(_record, _rowIndex) => {
        return {
        onContextMenu: (event) => {
            event.preventDefault();
            // grab and keep the clicked position
            const { clientX, clientY, target } = event;
            setPosX(clientX);
            setPosY(clientY);
            // grab the clicked cell value
            setValue(target.innerHTML);
            // show the overlay Menu
            setVisible(true);
        },
        // hide the overlay Menu on click
        onClick: () => setVisible(false)
        };
    }}
    
    />
}