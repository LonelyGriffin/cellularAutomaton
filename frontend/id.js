/**
 * Created by User on 07.12.2016.
 */

let setsOfReservedID = Symbol("setsOfReservedID");

class ID{
    constructor(){
        this[setsOfReservedID] = [];
    }
    reserve(){
        if(this[setsOfReservedID].length == 0){
            this[setsOfReservedID].push({
                start: 0,
                end: 0
            });
            return 0;
        }

        let set = this[setsOfReservedID][0];
        set.end++;
        let id = set.end;
        if(this[setsOfReservedID].length > 1){
            let forwardSet = this[setsOfReservedID][1];
            if(set.end + 1 == forwardSet.start){
                this[setsOfReservedID].split(0, 2, {
                    start: set.start,
                    end: forwardSet.end
                });
            }
        }
        return id;
    }
    free(id){
        for(let i = 0; i < this[setsOfReservedID].length; i++){
            if(this[setsOfReservedID][i].start >= id && this[setsOfReservedID][i] <= id){
                let set = this[setsOfReservedID][i];
                if(set.start != id && set.end != id ) {
                    let newSet = {start: set.start, end: id - 1};
                    let newNextSet = {start: id + 1, end: set.end};
                    this[setsOfReservedID].split(i, 1, newSet, newNextSet);
                } else {
                    if(set.start == id){
                        set.start++;
                    }
                    if(set.end == id){
                        set.end--;
                    }
                    if(set.start > set.end){
                        this[setsOfReservedID].split(i, 1);
                    }
                }
                break;
            }
        }
    }
}

export default new ID();