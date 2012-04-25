(ns caribou.admin.templates
  (:use [hiccup core]))


(def templates

  {
    :tools {
      :action-item (html [:a {:href "#"} "{{ label }}"])}

    :generic {
      :index {
               :main (html [:div#main_content

                           ;{{if viewData.response.length > 0}}
                           ;{{tmpl({viewSpec: viewSpec, viewData: viewData}) \"#scopes\"}}

                           [:div.paginated_collection
                             [:div.paginated_collection_contents
                               [:div.index_content
                                 [:div.index_as_table
                                   [:table.index_table {:border 0 :cellspacing 0 :cellpadding 0}
                                     [:thead
                                       [:tr
                                         ;; Populated via js
                                       ]]
                                     [:tbody
                                       ;; Populated via js

                                        ;{{each(i, row) viewData.response}}
                                        ;<tr id=\"${$data.viewSpec.meta.view.slug}_${row.id}\" class=\"{{if i%2==0}}odd{{else}}even{{/if}}\">
                                        ;  {{tmpl({viewSpec: $data.viewSpec, rowData: row}) \"#mainContentForGenericRow\"}}
                                        ;</tr>
                                        ;{{/each}}
                                      ]]]]
                                ;{{tmpl({viewSpec: viewSpec, viewData: viewData}) \"#indexFooter\"}}

                              ]]

                            ;{{else}}
                            ;<div class=\"blank_slate_container\">
                            ;  <span class=\"blank_slate\">There are no ${viewSlug} yet. <a href=\"/${viewSlug}/new\">Create one</a></span>
                            ;</div>
                            ;{{/if}}

                          ])

              :sidebar (html [:div#sidebar
                         ;{{tmpl({viewSpec: viewSpec, viewData: viewData}) \"#sidebarForGenericList\"}}\""}})
                        ])}}})
