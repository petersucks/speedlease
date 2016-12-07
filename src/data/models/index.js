import sequelize from '../sequelize';
import Search from './Search';

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Search };
