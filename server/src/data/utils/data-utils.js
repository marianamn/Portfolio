const pageDecrease = 1;
const utilsFunctions = require("../../utils/utils");
let { ObjectID } = require("mongodb");

let addParamToQuery = (query, param, value) => {
  if (value) {
    query[param] = value;
  }

  return query;
};

module.exports = {
  getAll(model, query) {
    let page = query.page;
    let perPage = query.perPage;

    let filterBy = {};
    let sortBy = {};

    addParamToQuery(filterBy, "title", query.title);
    addParamToQuery(filterBy, "name", query.name);

    addParamToQuery(sortBy, query.sort, query.order);

    let getCollectionCount = model.countDocuments();
    let getCollection = new Promise((resolve, reject) => {
      model
        .find(filterBy)
        .sort(sortBy)
        .skip((page - pageDecrease) * perPage)
        .limit(perPage)
        .exec((err, items) => {
          if (err) {
            reject(err);
          }

          return resolve(items);
        });
    });

    return Promise.all([getCollectionCount, getCollection]).then(
      ([count, collection]) => {
        let result = {
          count,
          collection
        };

        return result;
      }
    );
  },
  getById(model, id) {
    return new Promise((resolve, reject) => {
      model.findById({ _id: new ObjectID(id) }, (err, foundRecord) => {
        if (err) {
          reject(err);
        }

        return resolve(foundRecord);
      });
    });
  },
  save(model) {
    return new Promise((resolve, reject) => {
      return model.save(err => {
        if (err) {
          reject(err);
        }

        return resolve(model);
      });
    });
  },
  update(model, id, item) {
    return new Promise((resolve, reject) => {
      model.findOneAndUpdate(
        { _id: new ObjectID(id) },
        item,
        { runValidators: true, new: true },
        err => {
          if (err) {
            reject(err);
          }

          return resolve(model);
        }
      );
    });
  },
  delete(model, id) {
    return new Promise((resolve, reject) => {
      model.findOneAndDelete({ _id: new ObjectID(id) }, (err, item) => {
        if (err) {
          reject(err);
        }

        return resolve(item);
      });
    });
  },
  getUserByEmail(model, email) {
    return new Promise((resolve, reject) => {
      model.findOne({ email }, (err, user) => {
        if (err) {
          reject(err);
        }

        return resolve(user);
      });
    });
  }
};
