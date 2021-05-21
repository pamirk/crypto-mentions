import React, {useRef} from "react";
import {Button, Input, Space} from "antd";
import {SearchOutlined} from "@ant-design/icons";

const nameSearch = (value, record, dataIndex) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
function useColumnSearch() {
    const [searchText, setSearchText] = React.useState('')
    const [searchedColumn, setSearchedColumn] = React.useState('')
    let nameInput = useRef(null)

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };

    const getColumnSearchProps = (dataIndex, onFilter, type='text') => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    type={type}
                    ref={nameInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex)

                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) => onFilter ? onFilter(value, record, dataIndex) : nameSearch(value, record, dataIndex),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => nameInput.current.select(), 100);
            }
        },

    });
    return [getColumnSearchProps];
}

export default useColumnSearch;

