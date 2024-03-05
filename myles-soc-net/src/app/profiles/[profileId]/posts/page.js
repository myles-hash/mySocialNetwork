// import CreatePostBtn from "@/app/comps/CreatePostBtn";
// import EditProfileBtn from "@/app/comps/EditProfileBtn";
// import ScrollAreaDemo from "@/app/comps/RadixScroll";
// import { auth } from "@clerk/nextjs";
// import { sql } from "@vercel/postgres";
// import { revalidatePath } from "next/cache";
// import { notFound, redirect } from "next/navigation";



// export const metadata = {
//     title: "Myles Social Network | Posts",
//     description: "Posts made on the Myles social network",
//   };

// export default async function ProfilePage({ params }) {
//     const {userId} = auth();


//     const profile = await sql `
//     SELECT * FROM profiles WHERE id = ${params.profileId}
//     `;

//     if (profile.rowCount === 0){
//       notFound();
//     }

//     const posts = await sql `
//     SELECT * FROM posts WHERE user_id = ${profile.rows[0].clerk_user_id} ORDER BY id desc
//     `;

    

//     async function handleEditProfile(formData) {
//         "use server";
    
//         const username = formData.get("username");
//         const bio = formData.get("bio");
    
//         await sql`UPDATE profiles SET username = ${username}, bio = ${bio} WHERE clerk_user_id = ${userId}`;
//         revalidatePath(`/profiles`);
//         revalidatePath(`/profiles/${params.profileId}/posts`);
//         redirect(`/profiles/${params.profileId}/posts`);
//       }


//       async function handleCreatePost(formData) {
//         "use server";
//         const title = formData.get("title");
//         const content = formData.get("content");

//         await sql`INSERT INTO posts (title, content, user_id) VALUES (${title}, ${content}, ${userId})`;

//         revalidatePath(`/profiles/${params.profileId}/posts`);
//     }



//     return (
//         <div>
//                 <p>username:</p>
//                 <h1>{profile.rows[0].username}</h1>
//                 <p>bio:</p>
//                 <h2>{profile.rows[0].bio}</h2>
            
                
//                 {userId === profile.rows[0].clerk_user_id && (
//                 <div>
//               <form action={handleEditProfile}>
//                  <h4>Edit profile</h4>
//                  <input
//                    name="username"
//                    placeholder="Username"
//                    defaultValue={profile.rows[0].username}
//                    required
//                  />
//                  <textarea
//                    name="bio"
//                    placeholder="Bio"
//                    defaultValue={profile.rows[0].bio}
//                    required
//                  ></textarea>
//                  <EditProfileBtn />
//                </form>
//                </div>
//                 )}
                
//                  <h1>Posts by {profile.rows[0].username}</h1>
//       {userId === profile.rows[0].clerk_user_id && (<form action={handleCreatePost}>
//         <h4>Add a new post</h4>
//         <input name="title" placeholder="Post Title" />
//         <textarea name="content" placeholder="Post content" ></textarea>
//         <CreatePostBtn />
//       </form>)}
//       {!userId && <div><h2>Please... Sign in to add posts</h2></div>}
     
//             <ScrollAreaDemo posts={posts} profileId={params.profileId}/>
//                </div>
//     )

              
// }


'use client';

import { useState, useEffect } from "react";
// import AddAlbum from "./AddAlbum";



const CLIENT_ID="d4f2b82471934979a5fdc3296de5b02e";
const CLIENT_SECRET="d8981fc6821c4138a5e08ec4ac771350";



export default function Form() {
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [artistSuggestions, setArtistSuggestions] = useState([]);
    const [artist, setArtist]= useState("");
    const [albums, setAlbums] = useState([ ]);
    const [albumTracks, setAlbumTracks] = useState([ ]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [formData, setFormData] =useState({
        album_score: '',
        album_review: '',
        fav_track: ''
      });

    
  useEffect(() => {
    let authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
    async function fetchData() {
    const response = await fetch('https://accounts.spotify.com/api/token', authParameters);
    const data = await response.json();
    setAccessToken(data.access_token);
    }
    fetchData();
    }, []);

  
    useEffect(() => {
      async function fetchArtistSuggestions() {
        if (searchInput.trim() !== "") {
          let searchParameters = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          };
  
          const response = await fetch(
            "https://api.spotify.com/v1/search?q=" +
              searchInput +
              "&type=artist",
            searchParameters
          );
          const data = await response.json();
          setArtistSuggestions(data.artists.items);
        } else {
          setArtistSuggestions([]);
        }
      }
  
      fetchArtistSuggestions();
    }, [searchInput, accessToken]);
  



    async function search( artistId ) {

        let searchParameters = {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
            }

        }


        await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums' + '?include_groups=album&market=GB&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {console.log("This", data.items[0].id); setAlbums(data.items);})



    }

    async function fetchTracks(albumId) {
      await fetch(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Tracks for album with ID", albumId, ":", data.items);
            setAlbumTracks(data.items);
              setSelectedAlbumId(albumId);
          })

      }

      const handleFormChange = (e, albumId) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [albumId]: {
            ...prevState[albumId],
            [name]: value
          }
        }));
      };

      const handleAlbumChange = (e) => {
        const albumId = e.target.value;
        setSelectedTrack(''); 
        setAlbumTracks([]); 
        fetchTracks(albumId);
      };

    
    return(
<div className="form-outside-div"> 
    <div className="form-second-div">
        <form className="form-search-form" onChange={event => setSearchInput(event.target.value)} onSubmit={(e) => { e.preventDefault(); search(); }}>
    <input className="form-search-input" placeholder="Search For Artist" type="input" value={searchInput} onChange={event => setSearchInput(event.target.value)}/>
</form>
<ul className="results-list">
          {artistSuggestions.map((artist) => (
             <div key={artist.id} className="search-result" onClick={(e) => {search(artist.id); setArtistSuggestions([]); setSearchInput(''); setArtist(artist.name)}} >
             {artist.name}
            </div>
          ))}
        </ul>
        </div>
    <div className="form-third-div">
        {artist && <h2 className="available-albums-title">Available {artist} Albums:</h2>}
        <ul className="available-albums-uls">
            {albums.map(album => (
                <div key={album.id} className="album-map-div ">
                    <img src={`${album.images[0].url}`} className="album-map-img" />
                    <h3 className="album-map-h3">{album.name}</h3>
                    <a href={`${album.external_urls.spotify}`} target="_blank" className="album-map-play">Play</a>
                    <p className="album-map-p">Artist: {album.artists[0].name}</p>
                    <p className="album-map-p">Year: {album.release_date.substring(0, 4)}</p>
                    <h4 className="album-map-h4 ">Review Form</h4>
                    <select
                  onChange={(e) => { 
                    handleAlbumChange;
                    setSelectedTrack(e.target.value)}}
                  className="album-map-select"
                  onClick={() => { 
                      fetchTracks(album.id);
                  }}
                >
                  <option> Select a favorite track</option>
                  {albumTracks.map((track) => (
                    <option key={track.id} value={track.name}>
                      {track.name}
                    </option>
                  ))}
                </select>
                    {/* <AddAlbum 
                    album={album} 
                    formData={formData[album.id] || { album_score: ' ', album_review: ' '}} 
                    onFormChange={(e) => handleFormChange(e, album.id)} 
                    fav_track={selectedTrack} /> */}
                </div>
            ))}
        </ul>
    </div>
</div>


    )
    
}



