
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
require('selectize');

//var SimpleMDE = require('simplemde/dist/simplemde.min');
import * as SimpleMDE from 'simplemde/dist/simplemde.min';

//window.Dropzone = require('dropzone');
import * as Dropzone from 'dropzone';

require('jquery-ui/ui/widgets/autocomplete');

require('jquery-resizable/resizable');

require('featherlight');

require('jqtree');

window.snackbar = require('snackbar');

import Vue from 'vue';
window.Vue = Vue;

import Shares from './components/Shares.vue';
Vue.component('shares', Shares);

import Clients from './components/passport/Clients.vue';
Vue.component('passport-clients', Clients);

import AuthorizedClients from './components/passport/AuthorizedClients.vue';
Vue.component('passport-authorized-clients', AuthorizedClients);

import PersonalAccessTokens from './components/passport/PersonalAccessTokens.vue';
Vue.component('passport-personal-access-tokens', PersonalAccessTokens);

import VCalendar from 'v-calendar';
Vue.use(VCalendar, {
    firstDayOfWeek: 2
});

import Calendar from './components/Calendar.vue';
Vue.component('mini-calendar', Calendar);

window.markdownEditor = function () {
    var uuid = $('meta[name="uuid"]').attr('content')
        + '-' + $('meta[name="updated"]').attr('content').replace(/[-: ]/g, '');
    var simplemde = new SimpleMDE({
        element: $("#body-input")[0],
        autofocus: true,
        autosave: {
            enabled: true,
            uniqueId: uuid
        },
        spellChecker: false,
        toolbar: [
            {
                name: "bold",
                action: SimpleMDE.toggleBold,
                className: "fa fa-bold",
                title: "Bold"
            },
            {
                name: "italic",
                action: SimpleMDE.toggleItalic,
                className: "fa fa-italic",
                title: "Italic"
            },
            {
                name: "heading-2",
                action: SimpleMDE.toggleHeading2,
                className: "fa fa-header fa-header-x fa-header-2",
                title: "Medium Heading"
            },
            "|",
            {
                name: "quote",
                action: SimpleMDE.toggleBlockquote,
                className: "fa fa-quote-left",
                title: "Blockquote"
            },
            {
                name: "unordered-list",
                action: SimpleMDE.toggleUnorderedList,
                className: "fa fa-list-ul",
                title: "Generic List"
            },
            {
                name: "ordered-list",
                action: SimpleMDE.toggleOrderedList,
                className: "fa fa-list-ol",
                title: "Numbered List"
            },
            "|",
            {
                name: "link",
                action: SimpleMDE.drawLink,
                className: "fa fa-link",
                title: "Create Link"
            },
            {
                name: "image",
                action: SimpleMDE.drawImage,
                className: "fa fa-picture-o",
                title: "Insert Image"
            },
            {
                name: "table",
                action: SimpleMDE.drawTable,
                className: "fa fa-table",
                title: "Insert Table"
            }
        ]
    });
};

$('#parent-input').selectize({
    persist: false,
    valueField: 'id',
    labelField: 'path',
    searchField: 'title',
    create: false,
    load: function(query, callback) {
        if (!query.length) return callback();
        $.ajax({
            url: '/concepts',
            type: 'GET',
            dataType: 'json',
            data: {
                except: $(this).get(0).$input.data('except'),
                q: query
            },
            error: function() {
                callback();
            },
            success: function(res) {
                callback(res.data);
            }
        });
    }
});

$('#tags-input').selectize({
    delimiter: ',',
    persist: false,
    valueField: 'slug',
    labelField: 'name',
    searchField: 'name',
    create: function(input) {
        return {
            slug: input,
            name: input
        }
    },
    load: function(query, callback) {
        if (!query.length) return callback();
        $.ajax({
            url: '/tags',
            type: 'GET',
            dataType: 'json',
            data: {
                q: query
            },
            error: function() {
                callback();
            },
            success: function(res) {
                callback(res.data);
            }
        });
    }
});

$.widget( "custom.kfAutocomplete", $.ui.autocomplete, {
    _normalize: function (items) {
        return $.map(items.data, function(item) {
            return {
                value: item.id,
                label: item.title
            };
        });
    }
});

$('#search-input').kfAutocomplete({
    source: '/concepts?limit=10',
    minLength: 2,
    select: function(event, ui) {
        var url = '/concept/' + ui.item.value;

        event.preventDefault();
        location.href = url;
    }
});

$('#todoist_id-input').on('keyup', function () {
    var id = $(this).val();
    if (id === '') {
        $('#todoist-link').on('click', function(e) {
            e.preventDefault();
        });
    }
    else {
        $('#todoist-link').off('click');
    }
    $('#todoist-link').attr('href', 'https://todoist.com/showTask?id=' + id);
});

$('#generate-token').on('click', function () {
    $.get('/token', function (data) {
        alert('Your API token: ' + data.token);
    })
});
