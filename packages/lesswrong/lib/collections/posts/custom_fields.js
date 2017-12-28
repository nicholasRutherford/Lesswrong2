import { Posts } from "meteor/example-forum";
import ReactDOMServer from 'react-dom/server';
import { Components } from 'meteor/vulcan:core';
import React from 'react';
import Tags from 'meteor/vulcan:forms-tags'

const formGroups = {
  admin: {
    name: "admin",
    order: 2
  }
};

Posts.addField([
  /**
    URL (Overwriting original schema)
  */
  {
    fieldName: "url",
    fieldSchema: {
      order: 20,
      placeholder: "URL",
      control: 'EditUrl',
    }
  },
  /**
    Title (Overwriting original schema)
  */
  {
    fieldName: "title",
    fieldSchema: {
      order: 10,
      placeholder: "Title",
      control: 'EditTitle',
    },
  },
  /**
    Categories (Overwriting original schema)
  */
  {
    fieldName: "categories",
    fieldSchema: {
      editableBy: ['members'],
      insertableBy: ['members'],
      control: Tags
    }
  },


  /**
    Ory Editor JSON
  */
  {
    fieldName: 'content',
    fieldSchema: {
      type: Object,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
      control: 'EditorFormComponent',
      blackbox: true,
      order: 25,
    }
  },

  /**
    Html Body field, made editable to allow access in edit form
  */
  {
    fieldName: 'htmlBody',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      control: "textarea",
    }
  },

  /**
    Legacy: Boolean used to indicate that post was imported from old LW database
  */
  {
    fieldName: 'legacy',
    fieldSchema: {
      type: Boolean,
      optional: true,
      hidden: false,
      defaultValue: false,
      viewableBy: ['guests'],
      editableBy: ['admin'],
      insertableBy: ['admin'],
      control: "checkbox",
    }
  },

  /**
    Legacy ID: ID used in the original LessWrong database
  */
  {
    fieldName: 'legacyId',
    fieldSchema: {
      type: String,
      optional: true,
      hidden: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
    }
  },

  /**
    Legacy Spam: True if the original post in the legacy LW database had this post
    marked as spam
  */
  {
    fieldName: 'legacySpam',
    fieldSchema: {
      type: Boolean,
      optional: true,
      defaultValue: false,
      hidden: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
    }
  },

  /**
    Feed Id: If this post was automatically generated by an integrated RSS feed
    then this field will have the ID of the relevant feed
  */
  {
    fieldName: 'feedId',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      resolveAs: {
        fieldName: 'feed',
        type: 'RSSFeed',
        resolver: (post, args, context) => context.RSSFeeds.findOne({_id: post.feedId}, {fields: context.getViewableFields(context.currentUser, context.RSSFeeds)}),
        addOriginalField: true,
      },
      group: formGroups.admin,
    }
  },

  /**
    Feed Link: If this post was automatically generated by an integrated RSS feed
    then this field will have the link to the original blogpost it was posted from
  */
  {
    fieldName: 'feedLink',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      group: formGroups.admin
    }
  },

  /**
    body: Changed original body attribute to be just a plain-text version of the
    original content, to allow for search.
  */
  {
    fieldName: 'body',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      insertableBy: ['members'],
      editableBy: ['members'],
      hidden: true,
    }
  },

  /**
    legacyData: A complete dump of all the legacy data we have on this post in a
    single blackbox object. Never queried on the client, but useful for a lot
    of backend functionality, and simplifies the data import from the legacy
    LessWrong database
  */

  {
    fieldName: 'legacyData',
    fieldSchema: {
      type: Object,
      optional: true,
      viewableBy: ['admins'],
      insertableBy: ['admins'],
      editableBy: ['admins'],
      hidden: true,
      blackbox: true,
    }
  },

  /**
    lastVisitDateDefault: Sets the default of what the lastVisit of a post should be, resolves to the date of the last visit of a user, when a user is loggedn in. Returns null when no user is logged in;
  */

  {
    fieldName: 'lastVisitedAtDefault',
    fieldSchema: {
      type: Date,
      optional: true,
      hidden: true,
      viewableBy: ['guests'],
      resolveAs: {
        fieldName: 'lastVisitedAt',
        type: 'Date',
        resolver: (post, args, context) => {
          if(context.currentUser){
            const event = context.LWEvents.findOne({name:'post-view', documentId: post._id, userId: context.currentUser._id});
            return event ? event.createdAt : post.lastVisitDateDefault;
          } else {
            return post.lastVisitDateDefault;
          }
        }
      }
    }
  },

  /**
    FeaturedPriority: Determines which posts end up on the frontpage. Posts with higher priority are displayed first.
  */

  {
    fieldName: 'featuredPriority',
    fieldSchema: {
      type: Number,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      group: formGroups.admin,
    }
  },

  /**
    algoliaIndexAt: The last time at which the post has been indexed in Algolia's search Index.
    Undefined if it is has not been indexed.
  */

  {
    fieldName: 'algoliaIndexAt',
    fieldSchema: {
      type: Date,
      optional: true,
      viewableBy: ['guests'],
    }
  },

  {
    fieldName: 'collectionTitle',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins']
    }
  },

  {
    fieldName: 'userId',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      hidden: false,
      control: "text"
    }
  },

  {
    fieldName: 'canonicalSequenceId',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      resolveAs: {
        fieldName: 'canonicalSequence',
        addOriginalField: true,
        type: "Sequence",
        resolver: (post, args, context) => {
          if (!post.canonicalSequenceId) return null;
          return context.Sequences.findOne({_id: post.canonicalSequenceId})
        }
      },
      hidden: false,
      control: "text"
    }
  },

  {
    fieldName: 'canonicalCollectionSlug',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      hidden: false,
      control: "text",
      resolveAs: {
        fieldName: 'canonicalCollection',
        addOriginalField: true,
        type: "Collection",
        resolver: (post, args, context) => {
          if (!post.canonicalCollectionSlug) return null;
          return context.Collections.findOne({slug: post.canonicalCollectionSlug})
        }
      }
    }
  },

  {
    fieldName: 'canonicalBookId',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      hidden: false,
      control: "text",
      resolveAs: {
        fieldName: 'canonicalBook',
        addOriginalField: true,
        type: "Book",
        resolver: (post, args, context) => {
          if (!post.canonicalBookId) return null;
          return context.Books.findOne({_id: post.canonicalBookId})
        }
      }
    }
  },

  {
    fieldName: 'canonicalNextPostSlug',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      hidden: false,
      control: "text"
    }
  },

  {
    fieldName: 'canonicalPrevPostSlug',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins'],
      insertableBy: ['admins'],
      hidden: false,
      control: "text"
    }
  },

  /**
    unlisted: If true, the post is not featured on the frontpage and is not featured on the user page. Only accessible via it's ID
  */

  {
    fieldName: 'unlisted',
    fieldSchema: {
      type: Boolean,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['admins', 'sunshineRegiment'],
      insertableBy: ['admins', 'sunshineRegiment'],
      label: "Make only accessible via link",
      control: "checkbox",
      onInsert: (document, currentUser) => {
        if (!document.unlisted) {
          return false;
        }
      },
      onEdit: (modifier, post) => {
        if (modifier.$set.unlisted === null || modifier.$unset.unlisted) {
          return false;
        }
      }
    }
  },

  /**
    frontpage: The post is published to the frontpage
  */

  {
    fieldName: 'frontpage',
    fieldSchema: {
      type: Boolean,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
      optional: true,
      label: "Publish to frontpage",
      control: "checkbox",
      hidden: true,
      onInsert: (document, currentUser) => {
        if (!document.frontpage) {
          return false
        }
      },
      onEdit: (modifier, post) => {
        if (modifier.$set.frontpage === null || modifier.$unset.frontpage) {
          return false;
        }
      }
    }
  },

  /**
    Drafts
  */
  {
    fieldName: "draft",
    fieldSchema: {
      label: 'Save to Drafts',
      type: Boolean,
      optional: true,
      defaultValue: false,
      viewableBy: ['members'],
      insertableBy: ['members'],
      editableBy: ['members'],
      hidden: true,
    }
  },


  /**
    meta: The post is published to the meta section of the page
  */

  {
    fieldName: 'meta',
    fieldSchema: {
      type: Boolean,
      optional: true,
      viewableBy: ['guests'],
      editableBy: ['members'],
      insertableBy: ['members'],
      hidden: true,
      label: "Publish to meta",
      control: "checkbox",
      onInsert: (document, currentUser) => {
          if (!document.meta) {
            return false
          }
      },
      onEdit: (modifier, post) => {
        if (modifier.$set.meta === null || modifier.$unset.meta) {
          return false;
        }
      }
    }
  }

]);
