def dateExistsInDictArr(arr, date):
    index = 0
    for item in arr:
        if item['name'] == date:
            return index
        index += 1
    
    return -1
