import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Layout from "./pages/layout";
import OverviewPage from "./pages/overview";
import BasicPage from "./pages/basic";
import SortablePage from "./pages/sortable";
import SearchablePage from "./pages/searchable";
import PaginatedPage from "./pages/paginated";
import InfiniteScrollPage from "./pages/infinite-scroll";
import RowSelectionPage from "./pages/row-selection";
import RowActionsPage from "./pages/row-actions";
import DataExportPage from "./pages/data-export";
import ExpandablePage from "./pages/expandable";
import ColumnVisibilityPage from "./pages/column-visibility";
import ColumnReorderingPage from "./pages/column-reordering";
import ErrorHandlingPage from "./pages/error-handling";
import VirtualizedPage from "./pages/virtualized";
import KitchenSinkPage from "./pages/kitchen-sink";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<OverviewPage />} />
					<Route path="basic" element={<BasicPage />} />
					<Route path="sortable" element={<SortablePage />} />
					<Route path="searchable" element={<SearchablePage />} />
					<Route path="paginated" element={<PaginatedPage />} />
					<Route path="infinite-scroll" element={<InfiniteScrollPage />} />
					<Route path="row-selection" element={<RowSelectionPage />} />
					<Route path="row-actions" element={<RowActionsPage />} />
					<Route path="data-export" element={<DataExportPage />} />
					<Route path="expandable" element={<ExpandablePage />} />
					<Route path="column-visibility" element={<ColumnVisibilityPage />} />
					<Route path="column-reordering" element={<ColumnReorderingPage />} />
					<Route path="error-handling" element={<ErrorHandlingPage />} />
					<Route path="virtualized" element={<VirtualizedPage />} />
					<Route path="kitchen-sink" element={<KitchenSinkPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
