const episodesContainer = document.getElementById('last-episodes-container');
const lastAnimesContainer = document.getElementById('last-animes-container');

const animes = [{
        "titulo": "One Piece",
        "titulo_": "one_piece",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            },

            "4": {
                "file": "assets/01-01...",
                "author": ""
            },
            "5": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-one-piece.webp",
        "reciente": true,
        "cartel": "cartel-one-piece.jpg"
    },
    {
        "titulo": "Bleach",
        "titulo_": "bleach",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-bleach.jpg"
    },
    {
        "titulo": "Boku no Hero Academy",
        "titulo_": "boku_no_hero_academy",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-boku-no-hero-academy.png"
    },
    {
        "titulo": "Clannad",
        "titulo_": "Clannad",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-clannad.jpg"
    },
    {
        "titulo": "Shakugan no Shana",
        "titulo_": "shakugan_no_shana",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-shakugan-no-shana.jpg"
    },
    {
        "titulo": "Sword Art Online",
        "titulo_": "sword_art_online",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-sword-art-online.webp"
    },
    {
        "titulo": "Naruto Shippuden",
        "titulo_": "naruto_shippuden",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-naruto-shippuden.jpg"
    },
    {
        "titulo": "Mirai Nikki",
        "titulo_": "mirai_nikki",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mirai-nikki.jpg"
    },
    {
        "titulo": "Kimetsu no Yaiba",
        "titulo_": "kimetsu_no_yaiba",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-kimetsu-no-yaiba.jpg",
        "reciente": true,
        "cartel": "cartel-kimetsu.png"
    },
    {
        "titulo": "KonoSuba!",
        "titulo_": "KonoSuba!",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-konoSuba.png"
    },
    {
        "titulo": "Dr. Stone",
        "titulo_": "Dr._Stone",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-dr-stone.jpg"
    },
    {
        "titulo": "Mushoku Tensei",
        "titulo_": "mushoku_tensei",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg"
    },
    {
        "titulo": "Tate no Yuusha no Nariagari",
        "titulo_": "Tate no Yuusha no Nariagari",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-shield-hero.jpeg"
    },
    {
        "titulo": "Jujutsu Kaisen",
        "titulo_": "Jujutsu Kaisen",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-jujutsu.jpg"
    },
    {
        "titulo": "Tensei shitara Slime Datta Ken",
        "titulo_": "Tensei shitara Slime Datta Ken",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-tensura.jpg"
    },
    {
        "titulo": "Mahouka Koukou no Rettousei",
        "titulo_": "Mahouka Koukou no Rettousei",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-mahouka.jpg"
    },
    {
        "titulo": "Koutetsujou no Kabaneri",
        "titulo_": "Koutetsujou no Kabaneri",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-koutetsujou.jpg"
    },
    {
        "titulo": "Haikyuu!!",
        "titulo_": "Haikyuu!!",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-haikyuu.jpg"
    },
    {
        "titulo": "Shigatsu wa Kimi no Uso",
        "titulo_": "Shigatsu wa Kimi no Uso",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-kimi.jpg"
    },
    {
        "titulo": "Owari no Seraph",
        "titulo_": "Owari no Seraph",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-owari.png"
    },
    {
        "titulo": "Log Horizon",
        "titulo_": "Log Horizon",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-log.jpg"
    },
    {
        "titulo": "Death Parade",
        "titulo_": "Death Parade",
        "episodios": {
            "1": {
                "file": "assets/01-01...",
                "author": ""
            },
            "2": {
                "file": "assets/01-01...",
                "author": ""
            },
            "3": {
                "file": "assets/01-01...",
                "author": ""
            }
        },
        "thumbnail": "assets/thumb-mushoku-tensei.jpg",
        "reciente": true,
        "cartel": "cartel-death.png"
    }
];
let i = 1;
animes.forEach(
    anime => {
        if (i <= 12) {
            episodesContainer.innerHTML +=
                `
                <a href="episodio.html?anime=${anime.titulo_}&capitulo=24" class="card col-12 col-sm-6 col-md-6 col-lg-3">
                <div class="aspect-ratio-thumbnail">
                    <img src="${anime.thumbnail}" class="card-img-top" alt="Image not found">
    
    
                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                        <h5 class="card-title text-white">${anime.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Episodio 10.000</h6>
                    </div>
                </div>
    
                </a>
            `;
            i++;
        }

    }
);


animes.forEach(
    anime => {
        if (anime.reciente) {

            lastAnimesContainer.innerHTML +=
                `
            
                <div class="card col-12 col-sm-6 col-md-6 col-lg-3">
                    <div class="aspect-ratio-cartel">
                    <img src="assets/${anime.cartel}" class="card-img-top" alt="Image not found">
                    <div class="card-img-overlay d-flex flex-column justify-content-end align-items-center">
                        <h5 class="card-title text-white">${anime.titulo}</h5>
                    </div>
                    </div>
                </div>
            
            
            `;

        }
    }
)