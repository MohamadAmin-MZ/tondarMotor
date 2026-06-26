const articlesModel = require("../../model/v1/article")
const mongoose = require("mongoose")
const path = require("path")
const userModel = require("../../model/v1/user")
const mineBanerArticlesModel = require("../../model/v1/mainBanerArticles")
const mainBanerArticlesModel = require("../../model/v1/mainBanerArticles")
const textTitleArticlesModel = require("../../model/v1/textTitleArticles")

const create = async (req, res) => {
    try {
        const { title, body, description, href, publishedAt, readTime, showBar } = req.body

        if (!title || !body || !description || !href || !publishedAt || !readTime) {
            return res.status(400).json({ message: " title ,body ,description ,creator ,href ,publishedAt and readTime are required for a create." });
        }

        if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 80) {
            return res.status(400).json({ message: "The title must be a string between 3 and 80 characters." });
        }

        if (typeof body !== 'string' || body.trim().length === 0) {
            return res.status(400).json({ message: "body cannot empty." });
        }

        if (typeof description !== 'string' || description.trim().length < 3 || description.trim().length > 200) {
            return res.status(400).json({ message: "The description must be a string between 3 and 200 characters." });
        }

        if (typeof href !== 'string' || href.trim().length === 0) {
            return res.status(400).json({ message: "href cannot empty." });
        }

        if (publishedAt === undefined || publishedAt === null) {
            return res.status(400).json({ message: "publishedAt cannot empty." });
        }

        if (readTime === undefined || readTime === null) {
            return res.status(400).json({ message: "readTime cannot empty." });
        }
        const showBarr = Number(showBar);
        if (showBarr !== 1 && showBarr !== 0) {
            return res.status(400).json({ message: "showBar must be 1 or 0." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Cover Image Is Required." });
        }

        const coverPath = `/public/manufacturer/covers/${req.file.filename}`;

        const article = await articlesModel.create({
            title,
            body: mainText,
            description,
            href,
            publishedAt,
            readTime,
            cover: coverPath,
            creator: req.user._id,
            status: 1,
            showBar: showBar
        })

        return res.status(201).json({ article: article })
    } catch (error) {
        console.error("Error Creating Article:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getPageArticle = async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'view', 'v1', 'Article', 'Article.html'));
}

const getOne = async (req, res) => {
    try {
        const articleId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            return res.status(404).json({ message: "Article ID is Not Valid." });
        }

        const article = await articlesModel.findOne({ _id: articleId }).populate({ path: "creator", select: "name" })

        if (!article) {
            return res.status(404).json({ ok: false, message: "Article is Not Found." });
        }

        return res.status(200).json({ ok: true, article: article })
    } catch (error) {
        console.error("Error Get One Article:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAll = async (req, res) => {
    try {
        const articles = await articlesModel.find().populate({ path: "creator", select: "name" }).sort({ publishedAt: -1 })

        function createArticleElement(article) {

            const maxDescriptionLength = 100;
            let description = article.description;
            if (description.length > maxDescriptionLength) {
                description = description.substring(0, maxDescriptionLength) + "...";
            }

            return `
            <a href="http://localhost:4000/v1/article/${article._id}/page" class="article-link">
        <article class="article-card">
          <img class="thumb" src="${article.cover}" alt="${article.title}">
          <div class="meta">
            <span class="chip">زمان مطالعه: ${article.readTime} دقیقه</span>
            <span class="chip">انتشار: ${article.publishedAt}</span>
          </div>
          <div class="content">
            <h3 class="title">${article.title}</h3>
            <p class="excerpt">${description}</p>
          </div>
        </article>
        </a>
        `
        }

        const linksHtml = articles.map(article => createArticleElement(article));

        const allArticlesHtml = linksHtml.join('');

        return res.status(200).json({ ok: true, articles: allArticlesHtml });

    } catch (error) {
        console.error("Error Get All Article:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const update = async (req, res) => {
    try {
        const articleId = req.params.id

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No Update Data Provided In The Request Body." });
        }

        const { title, body, description, creator, href, status, publishedAt, readTime, showBar } = req.body

        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            return res.status(400).json({ message: "Article ID is Not Valid." });
        }

        const updateFields = {}

        if (showBar !== undefined && showBar !== "") {
            const showBarr = Number(showBar);
            if (showBarr !== 1 && showBarr !== 0) {
                return res.status(400).json({ message: "showBar must be 1 or 0." });
            }
            updateFields.showBar = showBar
        }

        if (title !== undefined && title.trim() !== "") {
            updateFields.title = title
        }

        if (body !== undefined && body.trim() !== "") {
            updateFields.body = body
        }

        if (description !== undefined && description.trim() !== "") {
            updateFields.description = description
        }

        if (creator !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(creator)) {
                return res.status(400).json({ message: "Invalid Creator ID." });
            }

            const isValidCreator = await userModel.findOne({ _id: creator })
            if (!isValidCreator) {
                return res.status(400).json({ message: "Creator Not Found." });
            }

            updateFields.creator = creator;
        }

        if (href !== undefined && href.trim() !== "") {
            updateFields.href = href
        }

        if (status !== undefined && status !== "") {
            if (status === 1) {
                updateFields.status = 1
            } else {
                updateFields.status = 0
            }
        }

        if (publishedAt !== undefined && publishedAt.trim() !== "") {
            updateFields.publishedAt = publishedAt
        }

        if (readTime !== undefined && readTime !== "") {
            updateFields.readTime = readTime
        }

        if (req.file) {
            updateFields.cover = `/public/manufacturer/covers/${req.file.filename}`
        }

        const articleUpdated = await articlesModel.findOneAndUpdate({ _id: articleId }, { $set: updateFields }, { returnDocument: "after" })

        if (!articleUpdated) {
            return res.status(404).json({ message: "Article Not Found." });
        }

        return res.status(200).json({ message: "Article Updated Successfully.", articleUpdate: articleUpdated })

    } catch (error) {
        console.error("Error Update Article:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const remove = async (req, res) => {
    try {
        const articleId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            return res.status(400).json({ message: "Article ID Is Not Valid." });
        }

        const deletedArticle = await articlesModel.findByIdAndDelete(articleId)

        if (!deletedArticle) {
            return res.status(404).json({ message: "Article Not Found." });
        }

        return res.status(200).json({ message: "Delete Article Successfully." })

    } catch (error) {
        console.error("Error Remove Article:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const articleBar = async (req, res) => {
    try {
        const articles = await articlesModel.find({ showBar: 1 });

        if (!articles || articles.length === 0) {
            return res.status(200).json({ ok: true, innerHTML: "" }); 
        }

        const maxDescriptionLength = 50;

        const HTML = articles.map(article => {
      
            let description = article.description || "";

            if (description.length > maxDescriptionLength) {
                description = description.substring(0, maxDescriptionLength) + "...";
            }
            return `
                <a href="http://localhost:4000/v1/article/${article._id}/page" class="article-link">
                    <article class="article-card">
                        <img src="${article.cover || '/path/to/default/image.jpg'}" alt="${article.title || 'Article Image'}">
                        <div class="card-content">
                            <div class="meta">
                                <span>${article.publishedAt || ''}</span>
                                <span>زمان مطالعه: ${article.readTime || '؟'}دقیقه</span>
                            </div>
                            <h3>${article.title || 'بدون عنوان'}</h3>
                            <p>${description}</p>
                        </div>
                    </article>
                </a>
            `;
        }).join("");

        return res.status(200).json({ ok: true, innerHTML: HTML });

    } catch (error) {
        console.error("Error get articleBar:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


const createMainBaner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Cover Image Is Required." });
        }

        const updata = await mainBanerArticlesModel.updateMany({ isActive: true }, { $set: { isActive: false } })

        const coverPath = `/public/manufacturer/covers/${req.file.filename}`;

        const baner = await mainBanerArticlesModel.create({ imageUrl: coverPath, isActive: true })

        return res.status(201).json({ message: "baner atricles is create.", baner })
    } catch (error) {
        console.error("Error create articles baner:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const mineBaner = async (req, res) => {
    try {
        const baner = await mineBanerArticlesModel.findOne({ isActive: 1 })

        return res.status(200).json({ ok: true, mainBanerArticles: baner })

    } catch (error) {
        console.error("Error geting mainBanerArticles:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const createTextTitleArticles = async (req, res) => {
    try {
        const { title, active } = req.body

        if (title.trim() === "" || title.trim() === undefined) {
            return res.status(400).json({ message: "articles title is empty." })
        }

        const isActive = Number(active);
        if (isActive !== 1 && isActive !== 0) {
            return res.status(400).json({ message: "Active must be 1 or 0." });
        }

        await textTitleArticlesModel.updateMany({ isActive: true }, { $set: { isActive: false } })

        const newTitle = await textTitleArticlesModel.create({ title: title, isActive: isActive })

        return res.status(200).json({ message: "new title articles created.", newTitle })

    } catch (error) {
        console.error("Error create title article.:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getTextTitleArticles = async (req, res) => {
    try {
        const title = await textTitleArticlesModel.findOne({ isActive: 1 })

        return res.status(200).json({ ok: true, title: title })
    } catch (error) {
        console.error("Error geting title article.:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {
    create,
    getOne,
    getAll,
    update,
    remove,
    articleBar,
    mineBaner,
    createMainBaner,
    createTextTitleArticles,
    getTextTitleArticles,
    getPageArticle
}