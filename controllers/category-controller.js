const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body

    if (!name) throw new Error('Category name is required')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category created successfully.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required')

    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist.")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category updated successfully.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    // TODO: advance DELETE, for relate data,
    // EX: delete '美式料理', related restaurant's category will be "未分類"
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist.")
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Category deleted successfully.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
