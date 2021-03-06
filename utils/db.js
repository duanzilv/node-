// 导入模块
const fs = require('fs')
const path = require('path')
// 基地址 json文件的 绝对路径
const fileName = path.join(__dirname, './data/hero.json')

function getAllhero() {
  const heros = JSON.parse(fs.readFileSync(fileName, 'utf-8'))
  return heros
}

module.exports = {
  // 1.获取所有数据方法 - 返回所有 isDelete = false 的对象 ------------------------------
  //   return 对象【数组】(isDelete = false)
  getHeros() {
    const heros = JSON.parse(fs.readFileSync(fileName, 'utf-8'));

    return heros
      .filter(v => !v.isDelete) // 筛选出 数组中 isDelete=true 的元素
      .map(({ id, name, skill, icon }) => { // 去掉 数组中 元素的 isDelete 属性
        return {
          id,
          name,
          skill,
          icon
        }
      })
  },
  // 2.新增 数据 方法 ------------------------------------------------------------
  //   参数：对象解构-含 三个 值
  //   return bool;(成功 - ture /  失败 - false)
  addHero({ name, skill, icon }) {
    let heros = getAllhero()
    heros.push({
      id: heros.length + 1,
      name,
      skill,
      icon,
      isDelete: false
    })
    // 保存回去
    if (!fs.writeFileSync(fileName, JSON.stringify(heros))) {
      return true
    } else {
      return false
    }
  },
  // 3.根据id获取数据 方法 ------------------------------------------------------------
  //   参数：想要获取的 对象的id
  //   return id匹配的对象 / null;
  getHeroById(id) {
    const heros = this.getHeros()
    const filterArr = heros.filter(v => {
      return v.id == id
    })
    if (filterArr[0]) {
      return filterArr[0]
    } else {
      return null
    }
  },
  // 4.根据id删除英雄 (软删除) 方法 -- 将 isDelete 属性设置为 true ------------------------------
  //   参数：想要删除的 对象的id
  //   return  bool;(成功 - ture /  失败 - false)
  deleteHeroById(id) {
    const heros = getAllhero()
    const filterArr = heros.filter(v => {
      return v.id == id
    })
    if (filterArr[0]) {
      filterArr[0].isDelete = true
      // 保存回去
      if (!fs.writeFileSync(fileName, JSON.stringify(heros))) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  // 5.编辑英雄 方法 ----------------------------------------------------------------------------------
  //   参数：对象解构-含 三个 值
  //   return  bool;(成功 - ture /  失败 - false)
  editHero({ id, name, skill, icon }) {
    let heros = getAllhero();
    const filterArr = heros.filter(v => {
      return v.id == id
    });
    // console.log(filterArr);
    if (filterArr[0]) {
      filterArr[0].name = name;
      filterArr[0].skill = skill;

      if (icon) // Boolean(icon) false: 0 -0 NaN '' undefeind null ...
      filterArr[0].icon = icon;

      // 保存回去
      if (!fs.writeFileSync(fileName, JSON.stringify(heros))) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}
