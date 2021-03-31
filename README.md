# coupons_api_rest
REST API : Coupons

Technologies utilisées :
	- NOSQL mongodb,
	- Node JS, express

Format Json coupon :
{
	_id: 1,
	libelle: "coupons X",
	discount: 37,
	deadline: "Mon Mar 29 2021 10:36:29 GMT+0200"
}
_id : int,
libelle : String,
discount : int,
deadline : UTC Date

Ajouter un coupon à la base de données:
POST /coupons input JSON, output JSON:

Input :
{
	libelle: "coupons X",
	discount: 37,
	deadline: "Mon Mar 29 2021 10:36:29 GMT+0200"
}

Output :
{
    "deadline": "2021-03-31T00:00:00.000Z",
    "discount": 27,
    "libelle": "Réduction 2021-03.",
    "_id": 2
}

récupérer tous les coupons de la base de données :
GET /coupons output JSON:
Output :
[
    {
        "_id": 1,
        "libelle": "coupons de test1",
        "discount": 37,
        "deadline": "Mon Mar 29 2021 10:36:29 GMT+0200"
    },
    {
        "_id": 2,
        "deadline": "2021-03-31T00:00:00.000Z",
        "discount": 27,
        "libelle": "Réduction 2021-03."
    }
]

Récupérer un coupon avec son ID:
GET /coupons/:id output JSON:
    {
        "_id": 1,
        "libelle": "coupons de test1",
        "discount": 37,
        "deadline": "Mon Mar 29 2021 10:36:29 GMT+0200"
    }

Supprimer un coupon de la base de données :
DELETE /coupons/:id :

Modifier un coupon de la base de données:
PATCH /coupons/:id input JSON, Output Json:
Input:
{
	“discount”:25
}
output :
{
        "_id": 1,
        "libelle": "coupons de test1",
        "discount": 25 ,
        "deadline": "Mon Mar 29 2021 10:36:29 GMT+0200"
}



