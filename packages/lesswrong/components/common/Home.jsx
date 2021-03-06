import { Components, registerComponent, withCurrentUser} from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';


const testCollections = [
  {
    title: "Rationality: A-Z",
    id: "dummyId",
    user: {userName: "Eliezer_Yudkowsky", displayName: "EliezerYudkowsky", slug: "eliezer_yudkowsky"},
    summary: 'A set of essays by Eliezer Yudkowsky that serve as a long-form introduction to formative ideas behind Less Wrong, the Machine Intelligence Research Institute, the Center for Applied Rationality, and substantial parts of the effective altruism community.',
    imageId: "dVXiZtw_xrmvpm.png",
    color: "#B1D4B4",
    big: true,
  },
  {
    title: "The Codex",
    id: "dummyId2",
    user: {username: "Yvain", displayName: "Scott Alexander", slug: "yvain"},
    summary: "The Codex contains essays about science, medicine, philosophy, politics, and futurism. (There’s also one post about hallucinatory cactus-people, but it’s not representative)",
    imageId: "ItFKgn4_rrr58y.png",
    color: "#88ACB8",
    big: false,
  },
  {
    title: "Harry Potter and the Methods of Rationality",
    id: "dummyId3",
    user: {userName: "Eliezer_Yudkowsky", displayName: "EliezerYudkowsky", slug: "eliezer_yudkowsky"},
    summary: "In an Alternate Universe, Petunia married a scientist. Now Rationalist!Harry enters the wizarding world armed with Enlightenment ideals and the experimental spirit.",
    imageId: "uu4fJ5R_zeefim.png",
    color: "#757AA7",
    big: false,
  }
]



const Home = (props, context) => {
  const currentView = _.clone(props.router.location.query).view || (props.currentUser && props.currentUser.currentFrontpageFilter) || (props.currentUser ? "frontpage" : "curated");
  const recentPostsTerms = _.isEmpty(props.location.query) ? {view: currentView, limit: 10} : props.location.query
  return (
    <div className="home">
      <Components.Section contentStyle={{marginTop: '-20px'}} title="Recommended Reading" titleLink="/library">
        <Components.CollectionsCard collection={testCollections[0]} big={true} url={"/rationality"}/>
        <Components.CollectionsCard collection={testCollections[1]} float={"left"} url={"/codex"}/>
        <Components.CollectionsCard collection={testCollections[2]} float={"right"} url={"/hpmor"}/>
      </Components.Section>
      <Components.Section title="Recent Posts"
        titleComponent= {<div className="recent-posts-title-component">
          <Components.PostsViews />
        </div>} >
        <Components.PostsList terms={recentPostsTerms} showHeader={false} />
      </Components.Section>
      <Components.Section title="Recent Comments" titleLink="/AllComments">
        <Components.RecentComments terms={{view: 'recentComments', limit: 10}} fontSize="small" />
      </Components.Section>
    </div>
  )
};

registerComponent('Home', Home, withCurrentUser);
