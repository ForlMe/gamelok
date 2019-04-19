
window.Userdefault = {

    // 1.加缓存机制     key为数组的时候    key[0]:键值 key[1]:缓存值
    // 2.是否需要加入float类型


    getIntForKey(key, value, append = undefined, tag = undefined, rank = undefined) {
        if (typeof key == "object") {
            this.getJsonForKey(key, append);
            if (tag === undefined) {
                tag = "def";
            }
            this.updateData(key, key[1], append, tag, rank, false, value);
            if (rank) {
                return key[1].max[tag];
            }
            return key[1].value[tag];
        }

        var _value = cc.sys.localStorage.getItem(this.getKey(key, append));
        if (_value === null || _value === "") {//微信上存的默认值
            return value;
        }
        if (_value === "0" || _value === "NaN" || _value === "nan") {//微信上的一些异常值和网页上的null
            return 0;
        }
        return parseInt(_value);
    },

    setIntForKey(key, value, append = undefined, tag = undefined, rank = undefined) {
        if (typeof key == "object") {
            if (tag === undefined) {
                tag = "def";
            }
            this.getIntForKey(key, 0, append, tag, rank);

            if (rank) {
                if (key[1].max[tag] >= value) {
                    key[1].value[tag] = value;
                }
                else {
                    key[1].max[tag] = value;
                    key[1].value[tag] = value;
                    this.setJsonForKey(this.getKey(key[0], append), key[1]);
                }
                return;
            }
            if (key[1].value[tag] === value) {
                return;
            }
            key[1].value[tag] = value;
            this.setJsonForKey(this.getKey(key[0], append), key[1]);
            return;
        }
        this.setDataForKey(this.getKey(key, append), value);
    },

    getBoolForKey(key, value, append = undefined, tag = undefined) {
        if (typeof key == "object") {
            this.getJsonForKey(key, append);
            if (tag === undefined) {
                tag = "def";
            }
            this.updateData(key, key[1], append, tag, false, false, value);
            return key[1].value[tag];
        }

        var _value = cc.sys.localStorage.getItem(this.getKey(key, append));
        if (_value === null || _value === 0) {
            return value;
        }
        if (_value === "true") {
            return true;
        }
        if (_value === "false") {
            return false;
        }
        return value;
    },

    setBoolForKey(key, value, append = undefined, tag = undefined) {
        if (typeof key == "object") {
            if (tag === undefined) {
                tag = "def";
            }
            this.getBoolForKey(key, false, append, tag);
            if (key[1].value[tag] === value) {
                return;
            }
            key[1].value[tag] = value;
            this.setJsonForKey(this.getKey(key[0], append), key[1]);
            return;
        }
        this.setDataForKey(this.getKey(key, append), value ? "true" : "false");
    },

    getStringForKey(key, value, append = undefined, tag = undefined) {
        if (typeof key == "object") {
            this.getJsonForKey(key, append);
            if (tag === undefined) {
                tag = "def";
            }
            this.updateData(key, key[1], append, tag, false, false, value);
            return key[1].value[tag];
        }

        var _value = cc.sys.localStorage.getItem(this.getKey(key, append));
        if (_value === null || _value === "") {
            return value;
        }
        else {
            return _value;
        }
    },

    setStringForKey(key, value, append = undefined, tag = undefined) {
        if (typeof key == "object") {
            if (tag === undefined) {
                tag = "def";
            }
            this.getStringForKey(key, "", append, tag);
            if (key[1].value[tag] === value) {
                return;
            }
            key[1].value[tag] = value;
            this.setJsonForKey(this.getKey(key[0], append), key[1]);
            return;
        }
        this.setDataForKey(this.getKey(key, append), value);
    },


    getArrayForKey(key, append = undefined) {
        if (typeof key == "object") {
            if (key[1] === undefined) {
                key[1] = this.getArrayForKey(this.getKey(key[0], append));
            }
            return key[1];
        }
        var _value = cc.sys.localStorage.getItem(this.getKey(key, append));
        if (_value === null || _value === "") {
            return [];
        }
        else {
            return JSON.parse(_value);
        }
    },

    setArrayForKey(key, value, append = undefined) {
        if (typeof key != "string") {
            key[1] = value;
            this.setArrayForKey(this.getKey(key[0], append), value);
            return;
        }
        this.setDataForKey(this.getKey(key, append), JSON.stringify(value));
    },

    getIntForKeyToDay(key, value, append = undefined, tag = undefined, rank = undefined) {
        this.getJsonForKey(key, append);
        if (tag === undefined) {
            tag = "def";
        }
        this.updateData(key, key[1], append, tag, rank, true, value);
        var date = this.getDay();
        if (key[1].toDay.date != date) {
            return value;
        }
        if (rank) {
            return key[1].toDay.max[tag];
        }
        return key[1].toDay.value[tag];
    },

    setIntForKeyToDay(key, value, append = undefined, tag = undefined, rank = undefined) {
        if (tag === undefined) {
            tag = "def";
        }
        this.getIntForKeyToDay(key, 0, append, tag, rank);
        var date = this.getDay();
        if (key[1].toDay.date != date) {
            key[1].toDay.date = date;
            if (rank) {
                key[1].toDay.max[tag] = value;
            }
            key[1].toDay.value[tag] = value;
            key[1].value[tag] = value - 1;//保证setIntForKey方法能够写入数据
            // this.setJsonForKey(this.getKey(key[0], append), key[1]);
            this.setIntForKey(key, value, append, tag, rank);
            return;
        }
        if (rank) {
            if (key[1].toDay.max[tag] >= value) {
                key[1].toDay.value[tag] = value;
            }
            else {
                key[1].toDay.max[tag] = value;
                key[1].toDay.value[tag] = value;
                key[1].value[tag] = value - 1;//保证setIntForKey方法能够写入数据
                // this.setJsonForKey(this.getKey(key[0], append), key[1]);
                this.setIntForKey(key, value, append, tag, rank);
            }
            return;
        }
        if (key[1].toDay.value[tag] === value) {
            return;
        }
        key[1].toDay.value[tag] = value;
        key[1].value[tag] = value - 1;//保证setIntForKey方法能够写入数据
        // this.setJsonForKey(this.getKey(key[0], append), key[1]);
        this.setIntForKey(key, value, append, tag, rank);
        return;
    },

    getJsonForKey(key, append = undefined) {
        if (typeof key != "string") {
            if (key[1] === undefined) {
                key[1] = this.getJsonForKey(this.getKey(key[0], append));
            }
            return key[1];
        }
        var _value = cc.sys.localStorage.getItem(this.getKey(key, append));
        if (_value === null || _value === "") {
            return null;
        }
        try {
            return JSON.parse(_value);
        }
        catch (err) {
            //数据不是json格式
            return _value;
        }
    },

    setJsonForKey(key, value, append = undefined) {
        if (typeof key != "string") {
            key[1] = value;
            this.setJsonForKey(this.getKey(key[0], append), value);
            return;
        }
        if (value) {
            this.setDataForKey(this.getKey(key, append), JSON.stringify(value));
        }
        else {
            this.setDataForKey(this.getKey(key, append), "");
        }
    },

    /**
     * 
     * @param dataType 数据类型  0 int  1  bool  2  string  3  数组
     */
    updateData(key, value, append, tag, rank = undefined, toDay = undefined, defaultValue = undefined) {
        var result = false;
        var temp = defaultValue;
        // if (value != null && typeof value != "object") {

        // }
        if (value === null) {// 第一次获取值
            value = {};
        }
        else if (typeof value != "object") {//第二次获取值，且值不是Json格式
            temp = value;
            value = {};
        }
        //初始化value值
        if (value.value === undefined) {

            value.value = {};
            result = true;
        }
        if (value.value[tag] === undefined || value.value[tag] === "") {
            value.value[tag] = temp;
        }
        //初始化max值
        if (rank) {
            if (value.max === undefined) {
                value.max = {};
                result = true;
            }
            if (value.max[tag] === undefined || value.max[tag] === "") {
                value.max[tag] = temp;
            }
        }

        //初始化toDay值
        if (toDay) {
            if (value.toDay === undefined) {
                value.toDay = { "date": this.getDay(), "value": {} };
                result = true;
            }
            if (value.toDay.value[tag] === undefined || value.toDay.value[tag] === "") {
                value.toDay.value[tag] = temp;
            }
            if (rank) {
                if (value.toDay.max === undefined) {
                    value.toDay.max = {};
                    result = true;
                }
                if (value.toDay.max[tag] === undefined || value.toDay.max[tag] === "") {
                    value.toDay.max[tag] = temp;
                }
            }
        }

        if (result) {
            this.setJsonForKey(key, value, append);
        }
    },


    init() {
        //清除昨天的记录
    },
    info() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            for (var a in cc.sys.localStorage)
                console.log(a + "-" + cc.sys.localStorage[a]);
        }
        Config.print(cc.sys.localStorage);
    },

    clear() {
        cc.sys.localStorage.clear();
    },

    getKey(key, append) {
        if (append) {
            return append + "_" + key;
        }
        return key;
    },

    clearForKey(key, append = undefined) {
        if (typeof key == "object") {
            this.clearForKey(key[0], append);
            return;
        }
        cc.sys.localStorage.removeItem(this.getKey(key, append));
    },

    getDataForKey(key, append = undefined) {
        return cc.sys.localStorage.getItem(this.getKey(key, append));
    },

    setDataForKey(key, value) {
        // cc.sys.localStorage.setItem(key, value);
        if (!this.writeData) {
            this.writeData = [];
        }
        for (const data of this.writeData) {
            if (data.key == key) {
                data.value = value;
                return;
            }
        }
        var data = { "key": key, "value": value };
        this.writeData.push(data);
        setTimeout(() => {
            cc.sys.localStorage.setItem(key, data.value);
            var index = 0;
            for (const data of this.writeData) {
                if (data.key == key) {
                    this.writeData.splice(index++, 1);
                }
            }
        }, 20 * this.writeData.length);

    },

    isKeyExist(key, append = undefined) {
        var value = cc.sys.localStorage.getItem(this.getKey(key, append));
        if (value === null || value === "") {
            return false;
        }
        return true;
    },

    getDay() {
        if (this.m_day) {
            this.m_day = parseInt(this.getTime() / 86400000);
        }
        return this.m_day;
    },
}
