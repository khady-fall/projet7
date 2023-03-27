const express=require("express");
const db=require("./db.js");

const app=express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const port=3000;

app.get("/",function(req,res){
    res.json({message:"l'api marche"});
});
 
// liste des articles
app.get("/api/articles",(req,res)=>{
    const sql="SELECT * FROM article";
    db.all(sql,(err,rows)=>{
        if (err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({message:"liste des articles",data:rows});
    });
});

// afficher un article par id
app.get("/api/articles/:id",(req,res)=>{
    const{id:articleID}=req.params
    const sql="SELECT * FROM article WHERE id=?";
    const params=[articleID]
    db.get(sql,params,(err,row)=>{
        if (err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({message:`article ${articleID} affiché`,data:row});
    });
});

// ajouté un article
app.post("/api/articles",(req,res)=>{
    const {titre, auteur,contenu ,resumé, datedesortie, derniéremisàjour}=req.body;
    if(!titre || !auteur || !contenu || !resumé ||!datedesortie || !derniéremisàjour){
        res.status(400).json({error:"merci de remplir tous les champs!"});
        return;
    }
    const article={titre,auteur,contenu ,resumé ,datedesortie,derniéremisàjour};
    const sql='INSERT INTO article(titre,auteur,contenu ,resumé ,datedesortie,derniéremisàjour)values(?,?,?,?,?,?)'
    const params=[article.titre,article.auteur,article.contenu,article.resumé,article.datedesortie,article.derniéremisàjour]
    db.run(sql,params,function(err,result){
      if(err){
        res.status(400).json({error:err.message});
        return;
      }
      res
        .status(201)
        .json({message:"article créé avec succes",data:article});
    });
    
});
 
// modifier un article
app.put("/api/articles/:id",(req,res)=>{
    const{id:articleID}=req.params;
    const {titre, auteur,contenu ,resumé, datedesortie, derniéremisàjour}=req.body;
    if(!titre || !auteur || !contenu || !resumé ||!datedesortie || !derniéremisàjour){
        res.status(400).json({error:"merci de remplir tous les champs!"});
        return;
    }
    const article={titre,auteur,contenu ,resumé ,datedesortie,derniéremisàjour};
    const sql="UPDATE article SET titre=?,auteur=?,contenu=? ,resumé=?,datedesortie=?,derniéremisàjour=?WHERE id=?";
    const params=[article.titre,article.auteur,article.contenu,article.resumé,article.datedesortie,article.derniéremisàjour,articleID];
    db.run(sql,params,function(err,result){
      if(err){
        res.status(400).json({error:err.message});
        return;
      }
      res
        .status(201)
        .json({message:`article ${articleID} modifié`,data:article});
    }); 
});

// supprimé un artiicle
app.delete("/api/articles/:id",(req,res)=>{
    const {id:articleID}=req.params;
    const sql="DELETE FROM article WHERE id=?"
    db.run(sql,articleID,function(err,resultat){
        if(err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({
            message:`article ${articleID}supprimé`,
            data:this.changes,
        });
    });
});

// serveur
app.listen(port,function(){
    console.log(`api demarré au port:${port}`);
});