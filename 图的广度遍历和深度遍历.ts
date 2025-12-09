type MapNodeType = {
    value: number;
    children: MapNodeType[];
}

function maploopdfs(data: MapNodeType[]) {
    const result: number[] = [];
    function map(dataItem: MapNodeType[]) {
        dataItem.forEach((item: MapNodeType) => {
            result.push(item.value);
            item.children && map(item.children);
        });
    }
    map(data);
    return result;
   
}