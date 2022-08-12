const Permission = require("../../models/Permission")

exports.createPermission = async (req, res) => {
try {
    const { name } = req.body.data;
if(!name) return res.status(422).json({message: "Invalid info provided!"})
const save = await new Permission({ name: name}).save()
if(!save) return res.status(500).json({message: "Something went Wrong!"})
return  res.status(200).json({message: "Permission Saved!"})
} catch (err) {
    return res.status(500).json({err: err.message})
}
}

exports.allPermission = async (req, res) => {
    try {
    const all = await Permission.showAll()
    if(!all) return res.status(404).json({message: "No Record Found!"})
    return  res.status(200).json({all})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}
 

exports.deletePermission = async (req, res) => {
    try {
    const deleteP = await Permission.deleteOne({slug: req.params.name}).exec()
    if(deleteP.deletedCount != 1) return res.status(500).json({message: "Something went Wrong!"})
    return  res.status(200).json({message: "deleted_"})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}